import React from "react";
import {
    Drawer,
    List, ListItem, ListItemButton,  ListItemText,
} from "@mui/material";

import { NavLink } from "react-router-dom";

const drawerWidth = 240;

const navStyle = ({ isActive }) => ({
    backgroundColor: isActive ? "#2a43d1" : "transparent",
    color: isActive ? "white" : "inherit"
});

export default function Sidebar() {
    return (
        <>
            <Drawer
            variant="permanent"
            sx={{
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    backgroundColor: "#273168",
                    color: "white",
                    width: drawerWidth,
                    boxSizing: "border-box"
                }
            }}
            >
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink} to="/" style={navStyle}
                        >
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>
                    
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink} to="/addstudents" style={navStyle}
                        >
                            <ListItemText primary="Students" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink} to="/users" style={navStyle}
                        >
                            <ListItemText primary="Users" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
}