import React, {useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert'
import { Card, Col, Container, Row, Button, Table, Modal } from 'react-bootstrap'
import { BrowserRouter as Router, Link, Route, Routes, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik, Form, ErrorMessage } from "formik";
import "../src/App.css"
import moment from "moment";

// function Main() {
//   return (
//     <div>
      
//     </div>
//   );
// }

function Login() {
  const navigate = useNavigate();
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [checkOutCar, setcheckOutCar] = useState([]);
  const [size, setSize] = useState("");
  const [payment, setPayment] = useState("");
  const [carList, setcarList] = useState([{
    'plate_number' : 'NAZ 5071',
    'brand': 'Hyundai',
    'model': 'Accent',
    'color': 'Silver',
    'size': 'Small',
    'check_in': '03/05/2022 14:28:48'
  }]);

  // console.log(carList)
  const addVehicle = () => {
      setModalOpen(true)
  }
  const validationLogin = {
      username: Yup.string().required("Username is Required"),
      password: Yup.string().required("Password is required"),
  }
  const validationRegister = {
      plate_number: Yup.string().required("Plate Number is Required"),
      brand: Yup.string().required("Brand is Required"),
      model: Yup.string().required("Model is Required"),
      color: Yup.string().required("Color is Required"),
      // check_in: Yup.string().required("Check In is Required"),
}
  const formik_login = useFormik({
      initialValues: {
          username: "",
          password: "",
      },
      validationSchema: Yup.object(validationLogin),
      onSubmit: (values) => {
          if(values.username === 'admin' && values.password === 'admin'){
              setisLoggedIn(true)
              navigate.push('/main');
          }
        },
  });

  const formik_vehicle = useFormik({
    initialValues: {
        plate_number: "",
        brand: "",
        model: "",
        color: "",
        // check_in: "",
    },
    validationSchema: Yup.object(validationRegister),
    onSubmit: (values) => {
        values.size = size
        values.check_in = moment().format('DD/MM/YYYY HH:mm:ss')
        const setArrayVehicle = [values]
        setcarList([...carList, ...setArrayVehicle])
    },
});
  const setModalHide = () => {
    setModalOpen(false)
  }

  const checkOutVehicle = (event) => {
    const dataset = event.currentTarget.dataset
    const startTime = dataset.check_in;
    const endTime = moment();
    const total_hr = moment(moment(endTime, "DD/MM/YYYY HH:mm:ss").diff(moment(startTime, "DD/MM/YYYY HH:mm:ss"))).format("HH")
    alert(total_hr)
    const remain_hr = total_hr - 4
    let cost_size = 0
    if(dataset.size === 'Small'){
        cost_size = 20
    }else if(dataset.size === 'Medium'){
        cost_size = 60
    }else if(dataset.size === 'Large'){
        cost_size = 100
    }
    
    const total_amount_exceeding_hr = remain_hr * cost_size
    let total_amount = 0
    if(4 < total_hr){
        total_amount = total_amount_exceeding_hr + 40
    }else if (24 < total_hr){
        total_amount = total_amount_exceeding_hr + 40 + 500
    }else{
        total_amount = 40
    }
    
    setcheckOutCar([{'plate_number': dataset.plate_number, 'check_in': dataset.check_in, 'size': dataset.size, total_hr: total_hr, total_amt: total_amount}])
  }

  const checkOut = () => {
    
    if(payment < checkOutCar[0].total_amt){
      alert('Not Enough Money') 
      setcarList(carList.filter(({ plate_number }) => plate_number !== checkOutCar[0].plate_number));
      checkOutCar([])
    }else{
      alert('Successfully Check Out') 
    }
  }
  return (
    <div className="p-5">
      <Modal
          size='md'
          show={modalOpen}
          onHide={() => setModalHide()}
      >
                <Modal.Body> 
                  
                  <div>
                      <form onSubmit={formik_vehicle.handleSubmit}>
                        <Container fluid>
                            <h5>Input Vehicle</h5>
                            <div className="p-4">
                                <Row>
                                    <Col md={6}>
                                        <input className='customInput form-control' id='plate_number' name='plate_number' type='text' placeholder='Plate Number' onChange={formik_vehicle.handleChange} onBlur={formik_vehicle.handleBlur} value={formik_vehicle.values.plate_number} />
                                        {formik_vehicle.touched.plate_number && formik_vehicle.errors.plate_number ? <p className='validation'>{formik_vehicle.errors.plate_number}</p> : null}
                                    </Col>
                                    <Col md={6}>
                                        <input className='customInput form-control' id='brand' name='brand' type='text' placeholder='Brand' onChange={formik_vehicle.handleChange} onBlur={formik_vehicle.handleBlur} value={formik_vehicle.values.brand} />
                                        {formik_vehicle.touched.brand && formik_vehicle.errors.brand ? <p className='validation'>{formik_vehicle.errors.brand}</p> : null}
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col md={6}>
                                        <input className='customInput form-control' id='model' name='model' type='text' placeholder='Model' onChange={formik_vehicle.handleChange} onBlur={formik_vehicle.handleBlur} value={formik_vehicle.values.model} />
                                        {formik_vehicle.touched.model && formik_vehicle.errors.model ? <p className='validation'>{formik_vehicle.errors.model}</p> : null}
                                    </Col>
                                    <Col md={6}>
                                        <input className='customInput form-control' id='color' name='color' type='text' placeholder='Color' onChange={formik_vehicle.handleChange} onBlur={formik_vehicle.handleBlur} value={formik_vehicle.values.color} />
                                        {formik_vehicle.touched.color && formik_vehicle.errors.color ? <p className='validation'>{formik_vehicle.errors.color}</p> : null}
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col md={6}>
                                    <select className="form-select" 
                                      onChange={(e) => setSize(e.target.value)}
                                      defaultValue={size}
                                    >
                                      <option>Small</option>
                                      <option>Medium</option>
                                      <option>Large</option>
                                    </select>
                                    {formik_vehicle.touched.color && formik_vehicle.errors.color ? <p className='validation'>{formik_vehicle.errors.color}</p> : null}
                                   </Col>
                                </Row>
                                <br/>
                                <Row className="p-4">
                                    <Col md={12} xs={12}>
                                        <Button type="submit" variant="primary" type="submit">Save</Button> {'  '} <Button variant="danger" onClick={setModalHide}>Close</Button>
                                    </Col>
                                </Row>
                            </div>
                        </Container>
                      </form>
                  </div>
                
                {/* <Formik
                        enableReinitialize
                        initialValues={{
                          plate_number: "",
                          brand: "",
                          model: "",
                          color: "",
                          size: "",
                          check_in: "",
                    }}
                        validationSchema={validationRegister}
                        onSubmit={(values, {resetForm}) => {
                            console.log(values)
                            // const formData = new FormData();
                            // formData.append(
                            //     "image",
                            //     values.file,
                            //     values.file.name,
                            // );
                            // dispatch(imageUploadShop(formData));
                            // setTimeout(function() {
                            //     window.location.href = window.location;
                            // }, 3000);
                        }}
                    >
                        {({ errors, values, handleBlur, handleChange, handleSubmit, setFieldValue, touched }) => ( */}
                        
                        {/* )} */}
                {/* </Formik> */}
                    
                </Modal.Body>
            </Modal>
                    
      { isLoggedIn ? checkOutCar.length !== 0 ? <Container>
          <Row>
            <Col md={12}>
                <h5>Size: {checkOutCar[0].size}</h5>
            </Col>
            <Col md={12}>
                <h5>Check In: {checkOutCar[0].check_in}</h5>
            </Col>
            <Col md={12}>
                <h5>Check Out: {moment().format("DD/MM/YYYY HH:mm:ss")}</h5>
            </Col>
            <Col md={12}>
                <h5>Total Hr: {checkOutCar[0].total_hr}</h5>
            </Col>
            <Col md={12}>
                <h5>Total Price: {checkOutCar[0].total_amt}</h5>
            </Col>
            <Col md={12}>
              <h5>Pay: <input className='form-control' id='pay' name='pay' type='text' placeholder='Payment' onChange={(e) => setPayment(e.target.value)}/> </h5>
              { payment < checkOutCar[0].total_amt ? <p className='validation'>{'not enough money'}</p> : null}
            </Col>
            
            <Col md={12}>
              <Button variant="primary" onClick={checkOut}>Check Out</Button> {' '}
              <Button variant="danger">Cancel</Button>
            </Col>
          </Row>

      </Container>: <Container>
          <Row>
              <Col md={12}>
                  <h1>Parking System</h1>
              </Col>
              <Col md={12}>
                  <Button variant="primary" onClick={addVehicle}>New Park vehicle</Button>
              </Col>
          </Row>
          <br/>
          <Row>
            <Col md={12}>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Plate Number</th>
                          <th>Brand</th>
                          <th>Model</th>
                          <th>Color</th>
                          <th>Size</th>
                          <th>Check In</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                          {carList && carList.map((res) => {
                            return(<><tr><td>{res.plate_number}</td>
                            <td>{res.brand}</td>
                            <td>{res.model}</td>
                            <td>{res.color}</td>
                            <td>{res.size}</td>
                            <td>{res.check_in}</td>
                            <td><Button variant="primary" onClick={checkOutVehicle} data-plate_number={res.plate_number} data-check_in={res.check_in} data-size={res.size}>Check Out</Button></td></tr></>)
                          })}
                        
                      </tbody>
                    </Table>
                </Col>
          </Row>
      </Container> : <Container>
                    <Row>
                        <Col md={5}>
                            <Card className="shadow">
                                <Card.Body className="p-5">
                                    <Card.Title>Log In</Card.Title>

                                    <form onSubmit={formik_login.handleSubmit}>
                                        <div className='input-container mb-3 mt-5'>
                                        <input className='customInput form-control' id='username' name='username' type='text' placeholder='Username' onChange={formik_login.handleChange} onBlur={formik_login.handleBlur} value={formik_login.values.username} />
                                            {formik_login.touched.username && formik_login.errors.username ? <p className='validation'>{formik_login.errors.username}</p> : null}
                                        </div>
                                        <div className='input-container mb-3 mt-5'>
                                        <input className='customInput form-control' id='password' name='password' type='password' placeholder='Password' onChange={formik_login.handleChange} onBlur={formik_login.handleBlur} value={formik_login.values.password} />
                                            {formik_login.touched.password && formik_login.errors.password ? <p className='validation'>{formik_login.errors.password}</p> : null}
                                        </div>
                                        <br />
                                        <div className="d-grid gap-2">
                                            <Button type="submit" variant="primary" className="mt-3 default-btn" type="submit">LOG IN</Button>
                                        </div>
                                    </form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>}
            </div>
  );
}
export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          {/* <Route exact path="/main" element={<Main />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

