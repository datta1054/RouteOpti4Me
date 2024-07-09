import React from 'react';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '../Store/index';

const ListMaterial = (props) => {
    const { Tour, vehicle, cost, color, distance } = props;
    const dispatch = useDispatch();
    const { selectRoute } = bindActionCreators(actionCreators, dispatch);
    const mapRoutes = useSelector(state => state.routes.mapRoutes);

    const handleClick = () => {
        selectRoute(mapRoutes[Tour])
    }

    const secText = (
      <>
        <span style={{ display: "block" }}>Distance: {distance} Km</span>
        {/* <span style={{display: 'block'}}>Cost: ${cost}</span> */}
      </>
    );
    const primText = (
        <Typography variant="h6" marginTop={2} color={color}>{`Tour ${Tour+1}`}</Typography>
    )
    return (
        <>
            <ListItemButton
                alignItems='flex-start'
                divider={true}
                onClick={() => handleClick()}
            >
                <ListItemText primary={primText} secondary={secText} />
            </ListItemButton>
        </>
    );
}

export default ListMaterial;
