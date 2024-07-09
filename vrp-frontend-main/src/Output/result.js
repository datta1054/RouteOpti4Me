const result = [
    {
      id: "1",
      name: 'Test',
      dimension: 30,
      vehicles: 8,
      optimalValue: 6485,
      capacity: 20,
      depotNode: 0,
      nodeData: [
        {
          node: 0,
          latitude: 18.59,
          longitude: 73.7,
          demand: 0,
          priority: 0,
        },
        {
            node: 1,
            latitude: 18.64410358362954,
            longitude: 73.508115380411,
            demand: 0,
            priority: 0,
        },
        {
            node: 2,
            latitude: 18.85240048478782,
            longitude: 73.31664557785646,
            demand: 0,
            priority: 0,
        },
        {
            node: 3,
            latitude: 18.89131106133676,
            longitude: 73.25418421997338,
            demand: 0,
            priority: 0,
        },
        {
            node: 4,
            latitude: 18.578454839024914,
            longitude: 73.86756346154237,
            demand: 0,
            priority: 0,
        },
        {
            node: 5,
            latitude: 18.404555966218528,
            longitude: 73.7605175588893,
            demand: 0,
            priority: 0,
        },
        {
            node: 6,
            latitude: 18.53777692972263,
            longitude: 74.0938963169034,
            demand: 0,
            priority: 0,
        },
        {
            node: 7,
            latitude: 18.545987393311158,
            longitude: 74.13801948432294,
            demand: 0,
            priority: 0,
        }
      ],
      solution: { 
        routes: [
          {
            tour: [0, 1, 2, 3, 0], 
            tourDistance: 19104 
          },
          {
            tour: [0, 4, 7, 5, 6, 0], 
            tourDistance: 25512 
          }
        ],
        totalDistance: 79215
      },
      file: [26, 35, 42, 66]
    }
  ]

  export default result;