import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Map from "../Components/Map";
import Accords from "../Components/Accords.js";
import TrackingBar from "../Components/TrackingBar";
import AddLocModal from "../Components/AddLocModal";
import RemoveLocModal from "../Components/RemoveLocModal";
import { useSelector, useDispatch } from "react-redux";
import Switch from "@mui/material/Switch";
import Graph from "../Components/Graph";
import Lottie from "lottie-react";
import "./Home.css";

import mapLoader from "../animations/map-load.json";
import upload from "../animations/truck.json";
import { bindActionCreators } from "redux";
import actionCreators from "../Store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Home = () => {
  const { routeSolutionStatus, solutionData } = useSelector(
    (state) => state.solution
  );
  let graphReady = useSelector((state) => state.solution.graphReady);

  const [submit, setSubmit] = useState("");

  const submitButton = () => {
    setSubmit("");
  };

  const onToast = (message, isSuccess) => {
    console.log("burh");

    if (isSuccess) {
      toast.success(message, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
      });
    } else {
      toast.error(message, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
      });
    }
  };

  const [isMapView, setisMapView] = useState(false);
  const dispatch = useDispatch();
  const { fetchSavedSolutions } = bindActionCreators(actionCreators, dispatch);

  useEffect(() => {
    fetchSavedSolutions();
  }, [solutionData]);
  return (
    <Box
      component="main"
      style={{ marginTop: "80px" }}
      sx={{
        height: "100vh",
        flexGrow: 1,
        p: 3,
        fontFamily: "Manrope",
        fontWeight: 300,
      }}
    >
      <Switch
        disabled={!routeSolutionStatus}
        value={isMapView}
        defaultChecked
        color="primary"
        onChange={() => setisMapView((prev) => !prev)}
      />
      <span>{!isMapView ? "Graph View" : "Map View"}</span>
      <div
        style={{ marginTop: 35, boxShadow: "0px 0px 7px rgba(0, 0, 0, 0.2)" }}
      >
        <AddLocModal onToast={onToast} />
        <RemoveLocModal />
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <TrackingBar />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Accords
              fileProp={submit}
              submitButton={submitButton}
              onToast={onToast}
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            {!isMapView ? (
              <Card
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  overflow: "auto",
                }}
              >
                {graphReady ? (
                  <CardContent>
                    <Graph />
                  </CardContent>
                ) : (
                  <CardContent>
                    {routeSolutionStatus ? (
                      <div
                        style={{
                          display: "flex",
                          margin: 0,
                          padding: 0,
                          overflow: "hidden",
                          width: "100%",
                          height: "400px",
                        }}
                      >
                        <Lottie animationData={mapLoader} loop={true}></Lottie>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          margin: 0,
                          padding: 0,
                          width: "100%",
                          height: "120px",
                          overflow: "hidden",
                        }}
                        className="upload_lottie"
                      >
                        <Lottie
                          onClick={() => setSubmit("panel1")}
                          animationData={upload}
                          loop={true}
                        ></Lottie>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ) : (
              <Card style={{ height: "100%", overflow: "auto" }}>
                <CardContent>
                  {routeSolutionStatus === true ? <Map /> : null}
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </div>
    </Box>
  );
};

export default Home;
