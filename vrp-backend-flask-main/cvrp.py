import math
import pandas as pd
import numpy as np
import re
from operator import itemgetter
from ortools_google import *
import itertools
from math import radians, cos, sin, asin, sqrt
from pprint import pprint
import random
import statistics
from sklearn.cluster import KMeans
from k_means_constrained import KMeansConstrained

# Default scaling factor for distance matrix is 100
# https://developers.google.com/optimization/routing/tsp#scaling
scalar = 100


def parse_file(file):
    problemInfo={}
    df = pd.read_excel(file)
    capacity = df['capacity'][0]
    vehicles = df['no_of_trucks'][0]
    dimension = df['dimension'][0]
    depot_node = df['depot_node'][0]
    optimal_value = df['optimal_value'][0] 
    name = df['name'][0] 
    node_data =  pd.DataFrame(
            columns=["node", "latitude", "longitude", "demand", "priority"],
            data=df,
        )
    problemInfo["name"] = name
    problemInfo["dimension"] = dimension
    problemInfo["vehicles"] = vehicles
    problemInfo["optimal_value"] = optimal_value
    problemInfo["capacity"] = capacity    
    problemInfo["depot_node"] = depot_node    
    problemInfo["node_data"] = node_data    
    class ProblemInfo:
        def __init__(
            self,
            name,
            dimension,
            vehicles,
            optimal_value,
            capacity,
            depot_node,
            node_data,
        ):
            self.name = name
            self.dimension = int(dimension)
            self.vehicles = int(vehicles)
            self.optimal_value = int(optimal_value) if not pd.isna(optimal_value) else None
            self.capacity = int(capacity)
            self.depot_node = int(depot_node)
            self.node_data = node_data

    p1 = ProblemInfo(**problemInfo)
    return p1


def distance(lat1, lat2, lon1, lon2):
    # # Euclidean distance
    # return math.ceil(math.dist([lat1, lon1], [lat2, lon2]))

    #converts from degrees to radians.
    lon1 = radians(lon1)
    lon2 = radians(lon2)
    lat1 = radians(lat1)
    lat2 = radians(lat2)

    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(abs(a)))

    # Radius of earth in kilometers. Use 3956 for miles
    r = 6371
    return c * r

def find_route(node_data, vehicle_capacities, timeout):

    cost_matrix = []
    distance_matrix = []
    unique_priorities = sorted(node_data["priority"].unique().tolist())

    # Construct distance matrix
    for lat1, lon1 in zip(node_data["latitude"], node_data["longitude"]):
        node_d = []
        for lat2, lon2 in zip(node_data["latitude"], node_data["longitude"]):
            node_d.append(int(distance(lat1, lat2, lon1, lon2) * scalar))
        distance_matrix.append(node_d)
        # cost_matrix.append(node_d)

    longest_dist = max(list(itertools.chain(*distance_matrix)))
    priority_coefficient = longest_dist
    print('Priority Coefficient:', priority_coefficient)
    cols = ["latitude", "longitude", "priority"]
    for i1, (lat1, lon1, pri1) in enumerate(zip(*[node_data[k] for k in cols])):
        node_c = []
        for i2, (lat2, lon2, pri2) in enumerate(zip(*[node_data[k] for k in cols])):
            cost = distance_matrix[i1][i2] + (pri2*priority_coefficient)
            node_c.append(cost)
        cost_matrix.append(node_c)

    demand = node_data["demand"].copy()
    priorities = node_data["priority"].copy()
    depot = node_data["node"].index.values[0].item()

    priority_groups = [
        node_data.iloc[1:].loc[
            node_data["priority"] == p
        ]["node"].tolist() for p in unique_priorities
    ]
    print("Priority Groups:", priority_groups)

    # or tools
    data = create_data_model({
        "cost_matrix": cost_matrix, 
        "distance_matrix": distance_matrix, 
        "priority_groups": priority_groups, 
        "depot": depot, 
        "vehicle_capacities": vehicle_capacities, 
        "demand": demand, 
        "priorities": priorities,
    })
    route = generate_routes(data, timeout)
    return route



def cluster(node_data, num_of_v, capacity):
    vehicles = []
    d = {}
    no_clusters = math.ceil(len(node_data['node']) / 1000)
    min_s = 900
    
    if len(node_data['node']) <= 2*min_s:
        kmeans = KMeans(n_clusters=no_clusters, init ='k-means++', random_state=3425, n_init=1)
    else:
        kmeans = KMeansConstrained(n_clusters=no_clusters, size_min=min_s, size_max=2*min_s, init='k-means++', random_state=3425, n_init=1)
    kmeans.fit(node_data[node_data.columns[1:3]]) # Compute k-means clustering.
    node_data['cluster_label'] = kmeans.fit_predict(node_data[node_data.columns[1:3]])
    centers = kmeans.cluster_centers_ # Coordinates of cluster centers.
    labels = kmeans.predict(node_data[node_data.columns[1:3]]) # Labels of each point
    node_data.head(10)
    clusters = list(set(node_data['cluster_label'].tolist()))

    for i in clusters:
        total_demand = node_data.loc[node_data['cluster_label'] == i, 'demand'].sum()
        vehicles.append(math.ceil(total_demand/capacity))
        # print('Total Demand', total_demand, vehicles[-1], capacity)

    print('Used trucks:', sum(vehicles), ', Available trucks:', num_of_v)
    # if(sum(vehicles) > num_of_v):
    #     num_of_v += 1
    for i in clusters:
        d[i] = node_data[node_data['cluster_label'] == i]

    return [d, vehicles]
