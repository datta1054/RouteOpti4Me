import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';

const TrackingBar = () => {
    const locationsData = useSelector((state) => state.solution.solutionData);
    console.log("$$$$$$$$$$$$$$",locationsData)
    return (
      <Card>
        <CardContent style={{ overflowX: "auto" }}>
          <Grid container paddingX={2} style={{ minWidth: "40rem" }}>
            <Grid item xs={3} textAlign="center">
              <Typography variant="h4">
                {locationsData ? locationsData.totalDistance : 0}
              </Typography>
              <Typography fontSize={13}>Total Distance{" (Km)"}</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography variant="h4">
                {locationsData ? locationsData.solution.length : null}{locationsData?'/':null}{locationsData ? locationsData.vehicles : 0}
              </Typography>
              <Typography fontSize={13}>Vehicles Used</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography variant="h4">
                {locationsData ? locationsData.locations : 0}
              </Typography>
              <Typography fontSize={13}>Locations</Typography>
            </Grid>
            <Grid item xs={3} textAlign="center">
              <Typography variant="h4">
                {locationsData ? locationsData.totalDemand : 0}
              </Typography>
              <Typography fontSize={13}>Total Demand</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
}

export default TrackingBar;
