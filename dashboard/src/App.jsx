import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import AddStudents from "./pages/AddStudents";
import Users from "./pages/Users";

export default function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/addstudents" element={<AddStudents />} />
                    <Route path="/users" element={<Users />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}