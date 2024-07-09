import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Chip, List } from "@mui/material";
import ListMaterial from "./ListMaterial";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import actionCreators from "../Store/index";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generateColor, darken } from '../utils/color';


import UpdateIcon from "@mui/icons-material/Update";
import CommuteIcon from "@mui/icons-material/Commute";
import SendIcon from "@mui/icons-material/Send";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import xlsx from "../animations/xlsx.png"
import { SvgIcon } from '@mui/material';





export default function Accords({ fileProp, submitButton,onToast }) {
  const [expanded, setExpanded] = useState(false);
  const [file, setFile] = useState(null);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const {
    uploadFile,
    storeNodes,
    openAddLocModal,
    storeRoutes,
    emptyRoutes,
    fetchSolution,
    assignRoute,
    readyView,
    assignDemandType,
    selectSavedSol,
    deleteSolution,
  } = bindActionCreators(actionCreators, dispatch);

  const { mapRoutes } = useSelector((state) => state.routes);
  const { routeSolutionStatus } = useSelector((state) => state.solution);
  // const { routeAssigned } = useSelector((state) => state.solution);
  const { demandType } = useSelector((state) => state.solution);
  const { savedSolutionsData } = useSelector((state) => state.savedSolutions);

  // const locationsData = useSelector((state) => state.nodes.nodes);
  const fileId = useSelector((state) => state.file.fileId);
  const solutionData = useSelector((state) => state.solution.solutionData);
  const solution = useSelector((state) => state.solution);

  console.log("Solution Frontend =>", solutionData);
  console.log("FILE ID => ", fileId);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onInputChange = (e) => {
    setFile(e.target.files[0]);
  };


  const pannel1Function = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    submitButton();
  };

  const onSubmitFile = async (e) => {
    try {
      if (file) {
        setLoader(true);
        e.preventDefault();

        let parsed = new Uint8Array(await file.arrayBuffer());
        parsed = Array.from(parsed);
        console.log("PARSED=>", parsed);
        await uploadFile(parsed);
        setLoader(false);
         onToast("Upload successful. Click 'Display'", true);
      } else {
        onToast("Choose a File",false);
      }
    } catch (err) {
      onToast("Something Went Wrong",false);
    }
    setLoader(false);
  };

  const onFindSolution = async () => {
    setLoader(true);
    if (fileId) {
      await readyView(false);
      await fetchSolution(fileId);

      if (solutionData) {
        await storeNodes(solutionData.nodeData);
      }
    }
    setLoader(false);
  };

  const calcRoutes = async (center) => {
    const directionsService = new window.google.maps.DirectionsService();
    let tours = [];
    solutionData?.solution.forEach((route) => {
      let temp = [];

      for (let item of route.tour) {
        if (item !== solutionData.depotNode) {
          temp.push({
            location: {
              lat: solutionData.nodeData[item - 1].latitude,
              lng: solutionData.nodeData[item - 1].longitude,
            },
          });
        }
      }
      tours.push(temp);
    });
    return Promise.all(
      tours.map(async (tour, index) => {
        return await directionsService.route(
          {
            origin: center,
            destination: center,
            travelMode: window.google.maps.TravelMode.DRIVING,
            waypoints: tour,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              storeRoutes({
                index: index,
                dir: result,
                clr: darken(generateColor(index + 1)),
                tourDistance: solutionData.solution[index].tourDistance,
              });
            } else {
              console.error(`error fetching directions ${result}`);
              onToast("Something Went Wrong",false)
            }
          }
        );
      })
    );
  };

  const onSubmitNodes = async () => {
    emptyRoutes();
    await calcRoutes({
      lat: solutionData.nodeData[0]?.latitude,
      lng: solutionData.nodeData[0]?.longitude,
    });
    await assignRoute(true);

    // submitNodes(solutionData.nodeData);
  };

  const onDemandAdd = async () => {
    try{

      const id = fileId === null ? solution.solId : fileId;
      await assignDemandType(id, demandType, solutionData.nodeData);
      onToast("Demands updated",true);
    }catch{
      onToast("Something Went Wrong",false);

    }

  };

  return (
    <div>
      <ToastContainer />
      <Accordion
        expanded={expanded === "panel1" || fileProp}
        onChange={pannel1Function("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Upload</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction={"column"} alignItems={"center"} spacing={2}>
            <IconButton
              sx={{
                transition: "background-color 0.2s ease-out",
                "&:hover": {
                  backgroundColor: "#f2fcf5",
                },
                "&:not(:hover)": {
                  backgroundColor: "initial",
                },
              }}
              style={{
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="upload file"
              component="label"
            >
              <input hidden type="file" onChange={onInputChange} />
              <img src={xlsx} alt="Excel Sheet" style={{ width: "70px" }} />
            </IconButton>
            {file === null || file === undefined ? null : (
              <Chip label={file?.name} variant="outlined" />
            )}
            {loader ? (
              <CircularProgress size={"2.3rem"} />
            ) : (
              <div>
                <Button
                  style={{ marginRight: "10px" }}
                  variant="contained"
                  onClick={onSubmitFile}
                >
                  Submit
                </Button>
                <Button
                  style={{ marginLeft: "0px" }}
                  variant="outlined"
                  disabled={fileId ? false : true}
                  onClick={onFindSolution}
                >
                  Display
                </Button>
              </div>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            Locations
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ display: "flex", flexDirection: "column" }}>
          {solutionData?.nodeData && (
            <Card style={{ maxHeight: 450, overflow: "auto" }}>
              <CardContent>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  {solutionData?.nodeData?.map((loc, index) => (
                    <ListItemButton
                      alignItems="flex-start"
                      divider={true}
                      // onClick={() => openAddLocModal(index, loc.demand)}
                      key={index}
                    >
                      <ListItemText
                        primary={`Site ${loc.node} `}
                        secondary={
                          <>
                            <Typography component="div">
                              Latitude: {loc.latitude}
                            </Typography>
                            <Typography component="div">
                              Longitude: {loc.longitude}
                            </Typography>
                            <Typography component="div">
                              Demand: {loc.demand}
                            </Typography>
                          </>
                        }
                      />
                    </ListItemButton>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
          {solutionData?.nodeData ? (
            <div>
              <Button
                style={{ margin: "20px" }}
                variant="contained"
                onClick={() => {
                  onSubmitNodes();
                }}
                startIcon={<CommuteIcon />}
              >
                Find Route
              </Button>
              {/* <Button
                style={{ margin: "20px" }}
                variant="contained"
                disabled={demandType?.length === 0}
                onClick={() => {
                  onDemandAdd();
                }}
                startIcon={<UpdateIcon />}
              >
                Revise demand
              </Button> */}
            </div>
          ) : (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                color: "#7a7a7a",
              }}
            >
              Click Display
            </span>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
        disabled={false}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Tours</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Card style={{ maxHeight: 450, overflow: "auto" }}>
            <CardContent>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                {mapRoutes?.length !== 0
                  ? mapRoutes.map((route, index) => (
                      <ListMaterial
                        Tour={index}
                        vehicle={"1298"}
                        distance={route.tourDistance}
                        cost={"98"}
                        color={route.clr}
                        key={index}
                      />
                    ))
                  : "No Routes Assigned"}
              </List>
            </CardContent>
          </Card>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>Batch</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Card style={{ overflow: "auto" }}>
            <CardContent>
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                }}
              >
                {savedSolutionsData?.length !== 0
                  ? savedSolutionsData?.map((sol) => (
                      <div
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          display: "flex",
                        }}
                      >
                        <ListItemButton
                          alignItems="flex-start"
                          divider={true}
                          onClick={() => selectSavedSol(sol)}
                          key={sol?.id}
                        >
                          <ListItemText
                            primary={`${sol?.name} `}
                            // secondary={`Lat: ${loc.latitude} Long: ${loc.longitude} Demand: ${loc.demand} `}
                          />
                        </ListItemButton>
                        <IconButton aria-label="delete">
                          <DeleteIcon
                            onClick={() => {
                              console.log("delete clicked");
                              deleteSolution(sol?.id);
                            }}
                          />
                        </IconButton>
                      </div>
                    ))
                  : "Upload a problem file"}
              </List>
            </CardContent>
          </Card>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
