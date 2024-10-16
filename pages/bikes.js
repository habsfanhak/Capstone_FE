import { Button, Card, ListGroup, Container, Row, Col, Form, Collapse} from 'react-bootstrap';
import { isAuthenticated, addFavourite, readToken } from '@/lib/userActions';
import { getBikes, getFavourites, removeFavourite } from "@/lib/userActions";
import { useState, useEffect } from "react";
import bike_styles from '../styles/Bikes.module.css'
import Link from 'next/link';
import { format } from '@cloudinary/url-gen/actions/delivery';
import { getSalePrice } from '@/lib/userActions';




export default function Bikes() {
    const [bikes, setBikes] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [search, setSearch] = useState('');
    const [message, setMessage] = useState('');
    const [salePrice, setSalePrice] = useState("");

    // filtering
    const [open, setOpen] = useState(false);

    // wishlisted
    const [wishlisted, setWishlisted] = useState(false)

    // filter by bike type
    const [mountain, setMountain] = useState(false);
    const [road, setRoad] = useState(false);
    const [hybrid, setHybrid] = useState(false);
    const [commuter, setCommuter] = useState(false);
    const [foldingBike, setFoldingBike] = useState(false);

    // filter by frame material
    const [aluminum, setAluminum] = useState(false);
    const [carbon, setCarbon] = useState(false);
    const [steel, setSteel] = useState(false);

    // filter by wheel size
    const [lessTwenty, setLessTwenty] = useState(false); // [0, 20]
    const [twenty, setTwenty] = useState(false);
    const [twentyFour, setTwentyFour] = useState(false);
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
            const token = readToken()
            const email = token.decoded.email
            
            const data = await getBikes();
            const favourites = await getFavourites(email);

            setBikes(data);
            setFavourites(favourites);
        }
        fetchData();

        handleSearch();

        handleFilter();
        
    }, [mountain, road, hybrid, commuter, foldingBike, aluminum, carbon, steel, lessTwenty, twenty, twentyFour, front, all, frontAndBack, none, single, multi, price1, price2, price, wishlisted]);

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

    async function handleStarClick(bike, add) {
        if (isAuthenticated()) {
            const token = readToken()
            const email = token.decoded.email

            if (add)
            {
                await addFavourite(email, bike)
            }
            else
            {
                await removeFavourite(email, bike) 
            }
            setFavourites(await getFavourites(email))
        }
    }

    async function handleFilter() {

        const data = await getBikes();
        let filteredData = data;

        // Apply search filter
        if (search !== '') {
            filteredData = filteredData.filter(bike => bike.brand.toLowerCase().includes(search.toLowerCase()) || bike.model.toLowerCase().includes(search.toLowerCase()));
        }


        // Filter by bike type
        const selectedTypes = [];
        if (mountain) selectedTypes.push('Mountain');
        if (road) selectedTypes.push('Road');
        if (hybrid) selectedTypes.push('Hybrid');
        if (commuter) selectedTypes.push('Commuter');
        if (foldingBike) selectedTypes.push('Folding Bike');

        if (selectedTypes.length > 0) {
            filteredData = filteredData.filter(bike => selectedTypes.includes(bike.type));
        }

        // Filter by frame material
        const selectedMaterials = [];
        if (aluminum) selectedMaterials.push('Aluminum');
        if (carbon) selectedMaterials.push('Carbon');
        if (steel) selectedMaterials.push('Steel');

        if (selectedMaterials.length > 0) {
            filteredData = filteredData.filter(bike => selectedMaterials.includes(bike.frame_material));
        }


        // Apply filter options for wheel size
        const selectedSizes = [];
        if (lessTwenty) selectedSizes.push('Less than 20');
        if (twenty) selectedSizes.push('20-24');
        if (twentyFour) selectedSizes.push('Over 24');

        if (selectedSizes.length > 0) {
            filteredData = filteredData.filter(bike => {
                if (lessTwenty && bike.wheelSize < 20) return true;
                if (twenty && bike.wheelSize >= 20 && bike.wheelSize <= 24) return true;
                if (twentyFour && bike.wheelSize > 24) return true;
                return false;
            });
        }
        
        // Apply filter options for suspension type
        const selectedSuspensions = [];
        if (front) selectedSuspensions.push('Front');
        if (all) selectedSuspensions.push('All');
        if (frontAndBack) selectedSuspensions.push('Front and Back');
        if (none) selectedSuspensions.push('None');

        if (selectedSuspensions.length > 0) {
            filteredData = filteredData.filter(bike => selectedSuspensions.includes(bike.suspension));
        }

        // Apply filter options for gear type
        const selectedGears = [];
        if (single) selectedGears.push('Single');
        if (multi) selectedGears.push('Multi');

        if (selectedGears.length > 0) {
            filteredData = filteredData.filter(bike => selectedGears.includes(bike.gear));
        }

        // Apply filter options for price
        const selectedPrices = [];
        if (price1) selectedPrices.push('Less than $500');
        if (price2) selectedPrices.push('$500 - $10000');
        if (price) selectedPrices.push('More than $10000');

        // Wishlisted
        if (wishlisted) {
            filteredData = filteredData.filter(bike => checkFavourite(bike._id));
        }

        if (selectedPrices.length > 0) {
            filteredData = filteredData.filter(bike => {
                if (price1 && bike.price < 500) return true;
                if (price2 && bike.price >= 500 && bike.price <= 10000) return true;
                if (price && bike.price > 10000) return true;
                return false;
            });
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
        setFoldingBike(false);

        setAluminum(false);
        setCarbon(false);
        setSteel(false);

        setTwenty(false);
        setTwentyFour(false);
        setLessTwenty(false);

        setFront(false);
        setAll(false);

        setSingle(false);
        setMulti(false);

        setPrice1(false);
        setPrice2(false);
        setPrice(false);

        setWishlisted(false)

        //setAvailable(false);
        const data = await getBikes();
        setBikes(data);

    }

    function checkFavourite(id) {
        return favourites.includes(id); // Assuming favourites is an array of bike IDs          
    }

    if (!bikes) return null
    if (!favourites) return null

    return (
        <>
            <br/>
            <center><h2 style={{fontFamily: 'rethink'}}>Bikes</h2></center>
            <br/>

            <Container style={{marginTop: '6vh'}}>
                
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
                        {!wishlisted && <Button style={{marginLeft: '10px'}} variant="outline-warning" onClick={() => setWishlisted(!wishlisted)} aria-controls="filter" aria-expanded={open}>
                            Wishlist
                        </Button>}
                        {wishlisted && <Button style={{marginLeft: '10px'}} variant="warning" onClick={() => setWishlisted(!wishlisted)} aria-controls="filter" aria-expanded={open}>
                            Wishlist
                        </Button>}
                       
                        <Collapse in={open}>
                            
                            <Row>
                                <div id="example-collapse-text">
                                   {/* radios of every category */}
                                   <br/>
                                   <Row>
                                    <Col>
                                        <h5>Bike Type</h5>
                                        <Form.Check type="checkbox" label="Mountain" name="bikeType" checked={mountain} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setMountain(!mountain)
                                        }} />

                                        
                                        <Form.Check type="checkbox" label="Road" name="bikeType" checked={road} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setRoad(!road)
                                        }} />
                                        <Form.Check type="checkbox" label="Hybrid" name="bikeType" checked={hybrid} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setHybrid(!hybrid)
                                        }} />
                                        <Form.Check type="checkbox" label="Commuter" name="bikeType" checked={commuter} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setCommuter(!commuter)
                                        }} />
                                        <Form.Check type="checkbox" label="Folding Bike" name="bikeType" checked={foldingBike} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setFoldingBike(!foldingBike)
                                        }} />
                                    </Col>
                                    <Col>
                                        <h5>Frame Material</h5>
                                        <Form.Check type="checkbox" label="Aluminum" name="material" checked={aluminum} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setAluminum(!aluminum)
                                        }} />
                                        <Form.Check type="checkbox" label="Carbon" name="material" checked={carbon} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setCarbon(!carbon)
                                        }} />
                                        <Form.Check type="checkbox" label="Steel" name="material" checked={steel} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setSteel(!steel)
                                        }} />
                                    </Col>
                                    <Col>
                                        <h5>Wheel Size</h5>
                                        <Form.Check type="checkbox" label="Less than 20" name="size" checked={lessTwenty} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setLessTwenty(!lessTwenty)
                                        }} />
                                        <Form.Check type="checkbox" label="20-24" name="size" checked={twenty} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setTwenty(!twenty)
                                        }} />
                                        <Form.Check type="checkbox" label="Over 24" name="size" checked={twentyFour} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setTwentyFour(!twentyFour)
                                            }} />
                                    </Col>
                                    <Col>
                                        <h5>Suspension Type</h5>
                                        <Form.Check type="checkbox" label="Front" name="suspension" checked={front} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setFront(!front)}} />
                                        <Form.Check type="checkbox" label="All" name="suspension" checked={all} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setAll(!all)}} />
                                        <Form.Check type="checkbox" label="Front and Back" name="suspension" checked={frontAndBack} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setFrontAndBack(!frontAndBack)}} />
                                        <Form.Check type="checkbox" label="None" name="suspension" checked={none} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setNone(!none)}} />
                                    </Col>
                                    <Col>
                                        <h5>Gear Type</h5>
                                        <Form.Check type="checkbox" label="Single" name="gear" checked={single} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setSingle(!single)}} />
                                        <Form.Check type="checkbox" label="Multi" name="gear" checked={multi} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setMulti(!multi)}} />
                                    </Col>
                                    <Col>
                                        <h5>Price</h5>
                                        <Form.Check type="checkbox" label="Less than $500" name="price" checked={price1} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setPrice1(!price1)}} />
                                        <Form.Check type="checkbox" label="$500 - $10000" name="price" checked={price2} onChange={(e) => {
                                            e.preventDefault();
                                            //clearStates();
                                            setPrice2(!price2)}} />
                                        <Form.Check type="checkbox" label="More than $10000" name="price" checked={price} onChange={() => {setPrice(!price)}} />
                                    </Col>
                                    {/* <Col>
                                        <h5>Available</h5>
                                        <Form.Check type="radio" label="Available" name="available" checked={available} onChange={() => {}} />
                                    </Col> */}
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
                                            <Card.Title style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span>{bike.brand}</span>
                                                { !checkFavourite(bike._id) && <span className={bike_styles.star} onClick={() => handleStarClick(bike, true)}>☆</span>}
                                                { checkFavourite(bike._id) && <span className={bike_styles.star} onClick={() => handleStarClick(bike, false)}>★</span>}

                                            </Card.Title>
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
