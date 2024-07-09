# Route Optimization for Capacitated Vehicle Routing Problem

## Abstract
The Capacitated Vehicle Routing Problem (CVRP) is a critical optimization challenge in various industries, including transportation, delivery services, and supply chain management. It involves determining the most efficient way to deliver goods to a set of customers using a fleet of vehicles with limited capacity. This project aims to provide an effective solution to the CVRP, ensuring that each customer is visited once, the total demand on each route does not exceed vehicle capacity, and all routes start and end at a central depot.

## Tech Stack
The following technologies and tools were utilized in the development of this project:
- **Programming Language:** Python
- **Framework:** React Js, Node Js, Flask 
- **Mapping API:** Google Maps API
- **Optimization Library:** OR-Tools by Google

## System Design
### System Architecture
The system architecture is divided into several key components:
1. **Input Parsing Module:** Reads and validates the input data.
2. **Clustering Module:** Groups the input data into clusters to optimize routing.
3. **CVRP Solver Module:** Utilizes OR-Tools to find optimal routes.
4. **Output Display Module:** Visualizes the results on Google Maps.

### Sequence Diagram
The sequence diagram below illustrates the workflow of the system, from receiving input to displaying the optimized routes.

![System Architecture](path_to_system_architecture_diagram)

## Implementation
### Parsing the Input File
- The input file is read and parsed to extract relevant data such as locations and demand.

### Clustering the Input Data
- Data is clustered to manage large datasets efficiently and improve the solver's performance.

### Running the CVRP Solver
- The OR-Tools library is employed to solve the CVRP, generating optimal routes based on the constraints provided.

### Showing the Output on Google Maps
- The results, including the routes, are displayed on Google Maps for better visualization and understanding.

## Results
The project successfully demonstrates route optimization for different datasets, showing significant improvements in efficiency. The results are visualized on Google Maps, making it easy to interpret the optimized routes.
## Authors
- Gurudatta K Gadde
- Sathvik K
- Shivanagouda S A
- Shreya P Revankar
