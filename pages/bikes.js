import { Button, Card, ListGroup, Container, Row, Col, Form, Collapse} from 'react-bootstrap';
import { getBikes } from "@/lib/userActions";
import { useState, useEffect } from "react";
import bike_styles from '../styles/Bikes.module.css'
import Link from 'next/link';




export default function Bikes() {
    const [bikes, setBikes] = useState([]);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');

    // filtering
    const [open, setOpen] = useState(false);

    // filter by bike type
    const [mountain, setMountain] = useState(false);
    const [road, setRoad] = useState(false);
    const [hybrid, setHybrid] = useState(false);
    const [commuter, setCommuter] = useState(false);
    const [foldingbike, setFoldingbike] = useState(false);

    // filter by frame material
    const [aluminum, setAluminum] = useState(false);
    const [carbon, setCarbon] = useState(false);
    const [steel, setSteel] = useState(false);
    const [carbonfiber, setCarbonfiber] = useState(false);

    // filter by wheel size
    const [lessTwenty, setLessTwenty] = useState(false); // [0, 20]
    const [twenty, setTwenty] = useState(false);
    const [twentyfour, setTwentyfour] = useState(false);
    //const [twentyeight, setTwentyeight] = useState(false);

    // filter by suspension type
    const [front, setFront] = useState(false);
    const [all, setAll] = useState(false);
    const [frontAndBack, setFrontAndBack] = useState(false);
    const [none, setNone] = useState(false);

    // filter by gear type
    const [single, setSingle] = useState(false);
    const [multi, setMulti] = useState(false);

    // filter by price
    const [price, setPrice] = useState(false);
    const [price1, setPrice1] = useState(false);
    const [price2, setPrice2] = useState(false);

    // filter by available quantity
    const [available, setAvailable] = useState('');

    useEffect(() => {
        async function fetchData() {
            const data = await getBikes();
            setBikes(data);
        }
        fetchData();

        handleSearch();

        handleFilter();
        
    }, [mountain, road, hybrid, commuter, foldingbike, aluminum, carbon, steel, carbonfiber, lessTwenty, twenty, twentyfour, front, all, frontAndBack, none, single, multi, price1, price2, price, available]);

    async function handleSearch() {
        
        if (search === '') {
            const data = await getBikes();
            setBikes(data);
            setMessage('')
        } else {
            const data = await getBikes();
            const filteredData = data.filter(bike => bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase()));
            if (filteredData.length === 0) {
                setMessage('No bikes found');
            } else {
                setBikes(filteredData);
                setMessage('');
            }

        }
    }

    const handleFilter = async () => {
        let data = await getBikes();
        let filteredData = data;
    
        if (mountain) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and are of type mountain
                filteredData = filteredData.filter(bike => bike.type === 'Mountain' && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }

            filteredData = filteredData.filter(bike => bike.type === 'Mountain');
        }
        
        if (road) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and are of type road
                filteredData = filteredData.filter(bike => bike.type === 'Road' && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.type === 'Road');
        }
    
        if (hybrid) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and are of type hybrid
                filteredData = filteredData.filter(bike => bike.type === 'Hybrid' && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.type === 'Hybrid');
        }
    
        if (commuter) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and are of type commuter
                filteredData = filteredData.filter(bike => bike.type === 'Commuter' && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.type === 'Commuter');
        }
    
        if (foldingbike) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and are of type folding bike
                filteredData = filteredData.filter(bike => bike.type === 'Folding Bike' && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.type === 'Folding Bike');
        }
    
        if (aluminum) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and are of frame material aluminum
                filteredData = filteredData.filter(bike=> bike.brand === "Aluminum" && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.frame_material === 'Aluminum');
        }
    
        if (carbon) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and are of frame material carbon
                filteredData = filteredData.filter(bike => bike.brand === "Carbon" && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.frame_material === 'Carbon');
        }
    
        if (steel) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and are of frame material steel
                filteredData = filteredData.filter(bike => bike.brand === "Steel" && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.frame_material === 'Steel');
        }
    
        if (carbonfiber) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and are of frame material carbon fiber
                filteredData = filteredData.filter(bike => bike.brand === "Carbon Fiber" && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.frame_material === 'Carbon Fiber');
        }
    
        if (lessTwenty) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and have wheel size less than 20
                filteredData = filteredData.filter(bike=> bike.wheelSize < 20 && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.wheelSize < 20);
        }
    
        if (twenty) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and have wheel size between 20 and 24
                filteredData = filteredData.filter(bike => bike.wheelSize >= 20 && bike.wheelSize < 24 && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.wheelSize >= 20 && bike.wheelSize < 24);
        }
    
        if (twentyfour) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and have wheel size over 24
                filteredData = filteredData.filter(bike => bike.wheelSize >= 24 && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.wheelSize >= 24 && bike.wheelSize < 28);
        }
    
        if (front) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and have front suspension
                filteredData = filteredData.filter(bike => bike.suspension_type === 'Front Suspension' && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }

            filteredData = filteredData.filter(bike => bike.suspension_type === 'Front Suspension');
        }
    
        if (all) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and have both front and back suspension
                filteredData = filteredData.filter(bike => bike.suspension_type === 'all' && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.suspension_type == 'all');
        }
    
        if (frontAndBack) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and have both front and back suspension
                filteredData = filteredData.filter(bike => bike.suspension_type === 'Front and Back' && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            
            filteredData = filteredData.filter(bike => bike.suspension_type === 'Front and Back');
        }
    
        if (none) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and have no suspension
                filteredData = filteredData.filter(bike => bike.suspension_type === 'None' && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }

            filteredData = filteredData.filter(bike => bike.suspension_type === 'None');
        }
    
        if (single) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and have single gear
                filteredData = filteredData.filter(bike => bike.gear_type === 'Single-speed' && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.gear_type === 'Single-speed');
        }
    
        if (multi) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and have multi gear
                filteredData = filteredData.filter(bike => bike.gear_type === 'Multi-speed' && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.gear_type == 'Multi-speed');
        }
    
        if (price1) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and are less than $500
                filteredData = filteredData.filter(bike => bike.price < 500 && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.price < 500);
        }
    
        if (price2) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and are between $500 and $10000
                filteredData = filteredData.filter(bike => bike.price >= 500 && bike.price < 10000 && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.price >= 500 && bike.price < 10000);
        }
    
        if (price) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and are more than $10000
                filteredData = filteredData.filter(bike => bike.price >= 10000 && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.price >= 10000);
        }
    
        if (available) {
            if (search.length > 0) {
                // search for bikes that match the search keyword and are available
                filteredData = filteredData.filter(bike => bike.available_quantity > 0 && (bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase())));
            }
            filteredData = filteredData.filter(bike => bike.available_quantity > 0);
        }
    
        setBikes(filteredData);
    }

    
    // clear search function
    const clearSearch = async (e) => {
        setSearch('');
        setMessage('');
        
        // clear all filters
        setMountain(false);
        setRoad(false);
        setHybrid(false);
        setCommuter(false);
        setFoldingbike(false);

        setAluminum(false);
        setCarbon(false);
        setSteel(false);
        setCarbonfiber(false);

        setTwenty(false);
        setTwentyfour(false);
        setLessTwenty(false);

        setFront(false);
        setAll(false);

        setSingle(false);
        setMulti(false);

        setPrice1(false);
        setPrice2(false);
        setPrice(false);

        setAvailable(false);

        

        const data = await getBikes();
        setBikes(data);

    }


    return (
        <>
            <br/>
            <center><h2 style={{fontFamily: 'rethink'}}>Bikes</h2></center>
            <br/>

            {/* // add search bar
            // add search button
            // add search functionality */}
            <Container>
                
                <Row>
                    <Col>
                    <Form.Control type="text" placeholder="Search by keyword" value={search} onChange={e => setSearch(e.target.value)} />
                    </Col>
                    <Col>
                    <Button variant="outline-secondary" onClick={handleSearch}>Search</Button>
                    &nbsp;&nbsp;
                    <Button variant="outline-secondary" onClick={clearSearch}>Clear Search</Button>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                        <Button variant="outline-secondary" onClick={() => setOpen(!open)} aria-controls="filter" aria-expanded={open}>
                            Filter
                        </Button>
                       
                        <Collapse in={open}>
                            
                            <Row>
                                <div id="example-collapse-text">
                                   {/* radios of every category */}
                                   <br/>
                                   <Row>
                                    <Col>
                                        <h5>Bike Type</h5>
                                        <Form.Check type="radio" label="Mountain" name="type" checked={mountain} onChange={() => {setMountain(true)
                                            // set other types to false
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            // set all states to false
                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);
                            

                                        }
                                        } />

                                        
                                        <Form.Check type="radio" label="Road" name="type" checked={road} onChange={() => {setRoad(true)
                                            // set other types to false
                                            setMountain(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);


                                            // set all states to false
                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);

                                            
        
                                        }} />
                                        <Form.Check type="radio" label="Hybrid" name="type" checked={hybrid} onChange={() => {setHybrid(true)
                                            // set other types to false
                                            setMountain(false);
                                            setRoad(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            // set all states to false
                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);
                                            
                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);

                                        }} />
                                        <Form.Check type="radio" label="Commuter" name="type" checked={commuter} onChange={() => {setCommuter(true)
                                            // set other types to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setFoldingbike(false);

                                            
                                            // set all states to false
                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);
                                        }} />
                                        <Form.Check type="radio" label="Folding Bike" name="type" checked={foldingbike} onChange={() => {setFoldingbike(true)
                                            // set other types to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                        
                                            // set all states to false
                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);

                                        
                                        }} />
                                    </Col>
                                    <Col>
                                        <h5>Frame Material</h5>
                                        <Form.Check type="radio" label="Aluminum" name="frame" checked={aluminum} onChange={() => {setAluminum(true)
                                            // set all states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);


                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);
                                        }} />
                                        <Form.Check type="radio" label="Carbon" name="frame" checked={carbon} onChange={() => {setCarbon(true)
                                            // set all states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);

                                        }} />
                                        <Form.Check type="radio" label="Steel" name="frame" checked={steel} onChange={() => {setSteel(true)
                                            // set all states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setCarbon(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);
                                            setNone(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);
                                        
                                        }} />
                                        <Form.Check type="radio" label="Carbon Fiber" name="frame" checked={carbonfiber} onChange={() => {setCarbonfiber(true)
                                            // set all states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);
                                            setNone(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);
                                        
                                        
                                        }} />
                                    </Col>
                                    <Col>
                                        <h5>Wheel Size</h5>
                                        <Form.Check type="radio" label="Less than 20" name="wheel" checked={lessTwenty} onChange={() => {setLessTwenty(true)
                                            // set all states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setTwenty(false);
                                            setTwentyfour(false);
                                            //setLessTwenty(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);

                                            setSingle(false);
                                            setMulti(false);
                                            setNone(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            // set other wheel sizes to false
                                            setTwentyfour(false);
                                            setTwenty(false);

                                            setAvailable(false);


                                        }} />
                                        <Form.Check type="radio" label="20-24" name="wheel" checked={twenty} onChange={() => {setTwenty(true)
                                            // set all states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            

                                            setAvailable(false);

                                        
                                        }} />
                                        <Form.Check type="radio" label="Over 24" name="wheel" checked={twentyfour} onChange={() => {setTwentyfour(true)
                                            // set all states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);
                                        
                                        }} />
                                    </Col>
                                    <Col>
                                        <h5>Suspension Type</h5>
                                        <Form.Check type="radio" label="Front" name="suspension" checked={front} onChange={() => {setFront(true)
                                            // set all states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);

    


                                        
                                        }} />
                                        <Form.Check type="radio" label="All" name="suspension" checked={all} onChange={() => {setAll(true)
                                            // set all states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);


                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);


                                        
                                        
                                        
                                        }} />
                                        <Form.Check type="radio" label="Front and Back" name="suspension" checked={frontAndBack} onChange={() => {setFrontAndBack(true)
                                            // set all states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);
                                        
                                        }} />
                                        <Form.Check type="radio" label="None" name="suspension" checked={none} onChange={() => {setNone(true)
                                            // set all states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);

                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);
                                        }} />
                                    </Col>
                                    <Col>
                                        <h5>Gear Type</h5>
                                        <Form.Check type="radio" label="Single" name="gear" checked={single} onChange={() => {setSingle(true)
                                           // set all the states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);


                                        
                                        }} />
                                        <Form.Check type="radio" label="Multi" name="gear" checked={multi} onChange={() => {setMulti(true)
                                            // set all the states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);
                                        }} />
                                    </Col>
                                    <Col>
                                        <h5>Price</h5>
                                        <Form.Check type="radio" label="Less than $500" name="price" checked={price1} onChange={() => {setPrice1(true)
                                            // set all states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);

                                            setPrice2(false);
                                            setPrice(false);

                                            setAvailable(false);

                                        }} />
                                        <Form.Check type="radio" label="$500 - $10000" name="price" checked={price2} onChange={() => {setPrice2(true)
                                            // set all states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice(false);

                                            setAvailable(false);
                                        }} />
                                        <Form.Check type="radio" label="More than $10000" name="price" checked={price} onChange={() => {setPrice(true)
                                            // set all states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);

                                            setAvailable(false);
                                        }} />
                                    </Col>
                                    <Col>
                                        <h5>Available</h5>
                                        <Form.Check type="radio" label="Available" name="available" checked={available} onChange={() => {setAvailable(true)
                                            // set all states to false
                                            setMountain(false);
                                            setRoad(false);
                                            setHybrid(false);
                                            setCommuter(false);
                                            setFoldingbike(false);

                                            setAluminum(false);
                                            setCarbon(false);
                                            setSteel(false);
                                            setCarbonfiber(false);

                                            setLessTwenty(false);
                                            setTwenty(false);
                                            setTwentyfour(false);

                                            setFront(false);
                                            setAll(false);
                                            setFrontAndBack(false);
                                            setNone(false);

                                            setSingle(false);
                                            setMulti(false);

                                            setPrice1(false);
                                            setPrice2(false);
                                            setPrice(false);
                                        }} />
                                    </Col>
                                </Row>
                            
                                </div>   
                            </Row>            
                        </Collapse>
                    </Col>
                </Row>
                
            

            </Container>
            <br/>
            <br/>

            <Container>
                <Row>
                    {message && bikes && <p>{message}</p>}
                    {bikes.map((bike) => {
                        return (
                            <Col sm={12} md={4} key={bike._id}>
                                <Card className={bike_styles.custom_card}>
                                    <Card.Body>
                                        {bike.image && <Card.Img src={`https://res.cloudinary.com/dm5pccmxq/image/upload/${bike.image}`} />}
                                        <Card.Title>{bike.brand}</Card.Title>
                                        <Card.Text>
                                            {bike.model}
                                        </Card.Text>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item>Type: {bike.type}</ListGroup.Item>

                                        <ListGroup.Item>Price: ${bike.price}</ListGroup.Item>
                                        <ListGroup.Item>Available: {bike.available_quantity || 'Not Available'}</ListGroup.Item>
                                    </ListGroup>
                                    <Card.Body>
                                        <Button variant="outline-primary"><Link href={`/bike?model=${bike.model}`}>View</Link></Button> &nbsp; 
                                        <Button variant="primary">Add to Cart</Button>
                                    </Card.Body>
                                </Card>
                                <br/>
                            </Col>
                            
                        )
                    })}
                </Row>
            </Container>
        </>
    )
}
