import { React, useEffect, useState } from "react";

import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import actionCreators from "../Store/index";
import Chip from "@mui/material/Chip";
import { Grid } from "@mui/material";

const AddLocModal = ({ onToast }) => {

  const loc = useSelector((state) => state.modals.loc);

  const [demand, setDemand] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const [demandName, setDemandName] = useState();
  const [chips, setChips] = useState([]);
  const [name, setName] = useState([]);
  const [count, setCount] = useState([]);

  const dispatch = useDispatch();
  const { closeAddLocModal, addNodes, addChip } = bindActionCreators(
    actionCreators,
    dispatch
  );
  const open = useSelector((state) => state.modals.openAddLoc);
  const index = useSelector((state) => state.modals.index);
  const demandTypes = useSelector((state) => state.solution.demandType);

  const handleAdd = () => {
    if (
      demandName === undefined ||
      demandName?.trim().length === 0 ||
      name.includes(demandName)
    ) {
      onToast("Invalid Input", false);
    } else {
      name.push(demandName);
      count.push(parseInt(demand));
      chips.push({ items: demandName, quantity: parseInt(demand) });
      setRemaining((prev) => prev - demand);
    }
  };

  console.log("CHIPS =>", chips);

  const handleRemove = (item) => {
    console.log(item);
    let tempChips = chips.filter((x) => x.items !== item.items);
    let tempName = name.filter((x) => x !== item.items);
    let i = name.indexOf(item.items);
    console.log("to remove =>", i);
    let removed = count.splice(i, 1);

    setChips(tempChips);
    setName(tempName);
    setCount(count);
    setRemaining((prev) => prev + parseInt(removed[0]));
    console.log(tempChips, "name=>", tempName, "count=>", count);
  };

  const start = () => {
    const ChipsFromStore = demandTypes?.filter((x) => x.node === index + 1);
    if (ChipsFromStore.length === 1) {
      const result = ChipsFromStore[0].items.map((name, index) => ({
        items: name,
        quantity: parseInt(ChipsFromStore[0].quantity[index]),
      }));
      setChips(result);
      setName(ChipsFromStore[0]?.items);
      setCount(ChipsFromStore[0]?.quantity.map(Number));
      const sum = ChipsFromStore[0]?.quantity.reduce(
        (acc, curr) => parseInt(acc) + parseInt(curr),
        0
      );
      setRemaining(loc - sum);
    } else {
      setRemaining(loc);
    }
  };
  console.log(name, count);

  useEffect(() => {
    start();
  }, [loc]);

  const handleClose = () => {
    setDemand(0);
    setChips([]);
    closeAddLocModal();
    setName([]);
    setCount([]);
  };

  const onSubmit = async () => {
    if (remaining > 0) {
      if (name.includes("Others")) {
        let i = name.indexOf("Others");
        count[i] = count[i] + remaining;
      } else {
        name.push("Others");
        count.push(remaining);
      }
    }

    console.log("Name=>", name, "Count=>", count);

    await addChip({ node: index + 1, items: name, quantity: count });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onSubmit}
      fullWidth={true}
      PaperProps={{ style: { padding: "10px" } }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <DialogTitle>Site {index + 1}</DialogTitle>
        <DialogTitle>Stock : {remaining}</DialogTitle>
      </div>

      {chips.length !== 0 ? (
        <div
          style={{
            paddingLeft: "1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid direction="row" spacing={1}>
            {chips.map((item, index) => {
              return (
                <Chip
                  style={{ margin: "5px" }}
                  key={index}
                  label={item.items + " : " + item.quantity}
                  color="primary"
                  clickable={true}
                  onDelete={() => handleRemove(item)}
                />
              );
            })}
          </Grid>
        </div>
      ) : null}
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          value={demandName}
          label="Demand Name"
          fullWidth
          variant="standard"
          onChange={(e) => setDemandName(e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          value={demand}
          label="Demand"
          type="number"
          fullWidth
          variant="standard"
          onChange={(e) => setDemand(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <IconButton
          color="primary"
          disabled={remaining - demand < 0 || demand === 0}
          onClick={handleAdd}
        >
          <AddIcon fontSize="large" />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddLocModal;
