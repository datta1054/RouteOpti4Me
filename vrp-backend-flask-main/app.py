import json
import os
import io
import threading
import requests
import traceback
import pandas as pd
import numpy as np
import datetime
from datetime import timezone
from flask import Flask, flash, jsonify, request
from flask_cors import CORS
import logging
from random import randint
#from werkzeug import secure_filename
from cvrp import *
from gql import Client, gql
from gql.transport.requests import RequestsHTTPTransport

app = Flask(__name__)
CORS(app)

# constant seed for reproducibility
np.random.seed(3425)
    
# Check running of instances for reverse proxy
check = randint(0, 9999)

# Graphql Client setup
transport = RequestsHTTPTransport(
    url='http://localhost:8080/graphql',
    verify=True,
    retries=3,
)
client = Client(transport=transport, serialize_variables=True, fetch_schema_from_transport=True)
 
@app.route("/", methods = ["GET", "POST"])
def home():
    return jsonify({
        "identifier": check, 
    })



@app.route("/route", methods = ["GET", "POST"])
def generate_route():
    if (request.method == "POST"):
        clustered = request.args.get("clustered") == "1"
        gql_result = None
        if clustered:
            print("Executing /route?clustered=1")
            req_data = request.get_json()
            node_data = pd.read_json(req_data["data"])
            cluster_label = node_data["cluster_label"][0]
            depot = pd.read_json(req_data["depot"])
            node_data = pd.concat([depot, node_data]).reset_index(drop=True)
            
            # find route using ortools
            print(f"-------Solution Route Cluster #{cluster_label} ({req_data['id']}) start time-------", get_timestamp())
            solution = find_route(node_data, req_data["capacities"], req_data["timeout"])
            print(f"-------Solution Route Cluster #{cluster_label} ({req_data['id']}) end time-------", get_timestamp())
            
            if solution:
                route_distances = solution[1]
                truck_routes = []
                for sol in solution[0]:
                    route = [node_data['node'][i] for i in sol]
                    truck_routes.append(route)
                print(truck_routes)
                # update the solution
                for i in range(len(truck_routes)):
                    query = gql(
                    """
                        mutation updateProblemInfoSolution(
                                $id: ID!,
                                $tour: [Int],
                                $tourDistance: Int
                            ) {
                            updateProblemInfoSolution(id: $id, input: {
                                tour: $tour, 
                                tourDistance: $tourDistance
                            }) {
                                nModified
                                n
                                ok
                            }
                        }
                    """
                    )
                    variables = {
                        "id": req_data['id'],
                        "tour": truck_routes[i],
                        "tourDistance": route_distances[i]
                    }
                    gql_result = client.execute(query, variables)
                    # print("gql -> ", gql_result)
                return jsonify({
                    "identifier": check,
                    "clustered": clustered,
                    "gql_result": gql_result,
                    "solution": True,
                    "timeout": req_data["timeout"]
                })
            else:
                return jsonify({
                    "identifier": check,
                    "clustered": clustered,
                    "solution": False,
                    "timeout": req_data["timeout"]
                })
        else:
            print("Executing /route")
            data = request.get_json()
            id = data.get('id')
            uint8arr = data.get('file').get('data') # [78,65,77,69,32,...]
            # file = io.StringIO(bytes(uint8arr).decode('utf-8')) # in-memory file(.vrp)
            file = io.BytesIO(bytes(uint8arr)) # in-memory file(excel)
            # contents = file.getvalue()
            
            try:
                # p1 = parse_file(contents)
                p1 = parse_file(file)
            except Exception:
                traceback.print_exc()
                return jsonify({"message": "Unable to parse file."}), 400
            
            file.close()
            nodeData = json.loads(p1.node_data.to_json(orient="records"))

            # update the problemInfo with data
            query = gql(
                """
                    mutation UpdateProblemInfo(
                            $id: ID!,
                            $name: String
                            $dimension: Int
                            $vehicles: Int
                            $optimalValue: Int
                            $capacity: Int
                            $depotNode: Int
                            $nodeData: [NodeInfoInput]
                        ) {
                        updateProblemInfo(id: $id, input: {
                            name: $name,
                            dimension: $dimension,
                            vehicles: $vehicles,
                            optimalValue: $optimalValue,
                            capacity: $capacity,
                            depotNode: $depotNode,
                            nodeData: $nodeData,
                        }) {
                            nModified
                            n
                            ok
                        }
                    }
                """
            )
            variables = {
                "id": id,
                "name": p1.name,
                "dimension": p1.dimension,
                "vehicles": p1.vehicles,
                "optimalValue": p1.optimal_value,
                "capacity": p1.capacity,
                "depotNode": p1.depot_node,
                "nodeData": nodeData
            }
            gql_result = client.execute(query, variables)

            # return response and continue sending requests in another thread
            thread = threading.Thread(target=distribute_task, kwargs={
                'id': id,
                'p1': p1,
            })
            thread.start()

            return jsonify({
                "clustered": clustered,
                "identifier": check,
                "gql_result": gql_result,
            }), 202
    
    if (request.method == "GET"):
        # just to check if endpoint is active
        return jsonify({"identifier": check})
    
def distribute_task(**kwargs):
    # time consuming task distribution
    id = kwargs.get('id', None)
    p1 = kwargs.get('p1', {}) 
    depot = p1.node_data.loc[p1.node_data['node'] == p1.depot_node]
    node_data = p1.node_data.drop(p1.node_data[p1.node_data['node'] == p1.depot_node].index)
    print(f'-------Problem ({id}) clustering start time-------', get_timestamp())
    [clusters, vehicles] = cluster(node_data, p1.vehicles, p1.capacity)
    print(f'-------Problem ({id}) clustering end time-------', get_timestamp(), clusters)

    payload_queue = [{
        "id": id,
        # NOTE: Random capacities might give vehicles with 0 distance (extra_vehicles)
        # "capacities": np.random.choice(
        #     a=[p1.capacity+j*10 for j in range(3)], 
        #     size=vehicles[i],
        # ).tolist(),
        "capacities": [p1.capacity for x in range(vehicles[i])], 
        "depot": depot.to_json(orient="records"),
        "data":clusters[i].to_json(orient="records"),
        "timeout": 10,
    } for i in range(len(vehicles))]

    url = "http://localhost:5000/route?clustered=1"
    headers = {'content-type': 'application/json'}
    while payload_queue:
        try:
            payload = payload_queue.pop(0)
            # Fire and forget (Hacky)
            res = requests.post(url, json=payload, headers=headers)
            data = res.json()
            if not data["solution"] and data["timeout"] < 30:
                payload.update({
                    "timeout": payload["timeout"] + 40
                })
                payload_queue.append(payload)
        except requests.exceptions.ReadTimeout:
            pass

def get_timestamp():
    dt = datetime.datetime.now(timezone.utc)
    utc_time = dt.replace(tzinfo=timezone.utc)
    return utc_time.timestamp()

# main driver function
if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", True))

if __name__ != "__main__":
	# For logging in prod
    gunicorn_error_logger = logging.getLogger("gunicorn.error")
    app.logger.handlers = gunicorn_error_logger.handlers
    app.logger.setLevel(gunicorn_error_logger.level)
