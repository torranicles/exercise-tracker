import React from 'react'
import '../styles/Dashboard.css'
import axios from 'axios'
import AddOrDelete from './AddOrDelete'
import PulseLoader from "react-spinners/PulseLoader";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            duration: '',
            date: '',
            _id: null,
            newSubmit: null,
            successMessage: null,
            failMessage: null,
            loading: true,
            exercises: [],
            noLogs: false,
        }
        this.handleNewSubmit = this.handleNewSubmit.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
    }
    
    handleEdit(e) {
        axios.get('/exercise/log', {
            params: {
                exerciseId: e.target.id
            }
        }).then(res => {
            this.setState({
                newSubmit: false,
                _id: e.target.id,
                ...res.data.log[0]
            })
        })
    }

    handleEditSubmit(e) {
        e.preventDefault();
        let {description, duration, date} = this.state;
        axios.put('/edit', {
            description: description,
            duration: duration,
            date: date
        }, {
            params: {
                id: this.state._id
            }
        }).then(res => {
            if (res.data.message) { //Failure
                this.setState({
                    failureMessage: res.data.message
                })
            } else { //Success
                this.setState({ 
                    successMessage: res.data
                });
                this.getExercises();
            }
            setTimeout(() => {
                this.setState({
                    failureMessage: null,
                    successMessage: null
                });
                document.getElementById('form').reset();
            }, 2500);
        })
    }

    handleAdd() {
        this.setState({
            newSubmit: true
        })
        document.getElementById('form').reset();
    }

    confirmDelete(e) {
        document.getElementById('confirm-delete')
            .classList.remove('d-none');
        this.setState({
            _id: e.target.id
        })
    }
    
    handleDelete() {
        axios.delete('/delete', {
            params: {
                id: this.state._id
            }})
            .then(res => {
                if (res.data == "Exercise deleted") {
                    this.setState({
                        successMessage: res.data
                    });
                    this.getExercises();
                }
                setTimeout(() => {
                    this.setState({
                        successMessage: null
                    })
                }, 2500);
                document.getElementById('confirm-delete')
                    .classList.add('d-none');
            })
    }

    cancelDelete() {
        document.getElementById('confirm-delete')
        .classList.add('d-none');
    }

    handleChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleNewSubmit(e) {
        e.preventDefault();
        axios.post('/exercise/add', this.state)
            .then(res => {
                if (res.data.failureMessage) { //Failure
                    this.setState({
                        failureMessage: res.data.failureMessage
                    })
                } else {  //Success
                    this.getExercises();
                    this.setState({
                        successMessage: res.data.message
                    });
                    setTimeout(() => {
                        this.setState({
                            failureMessage: null,
                            successMessage: null
                        })
                    }, 2500);
                    document.getElementById('form').reset();
                }
            })
            .catch(err => console.log("Add error", err))
    }

    getExercises() {
        axios.get('/exercise/log')
        .then(res => {
            if (!this.state.exercises) {
                this.setState({
                    noLogs: true
                })
            }
            if (res.data.log) {
                this.setState({
                    exercises: res.data.log,
                    loading: false,
                });
            }
        })
    }

    componentDidMount() {
        this.getExercises();
    }

    render() {
        const {description, duration, date, newSubmit, loading, successMessage, failureMessage, exercises} = this.state;
        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-dark">
                    <a className="navbar-brand" href="#" style={{fontSize:'2rem'}}>Exercise Tracker</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse flex-row-reverse" id="collapsibleNavbar">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button onClick={this.props.handleLogout} className="btn btn-link text-white">Logout</button>
                            </li>
                        </ul>
                    </div>  
                </nav>
                <br/>
                <div className="container-md view-container d-flex justify-content-center">
                    <div className="container-md w-100 p-0">
                            <div className="container-md justify-content-center flex-column w-100 p-3 data-container">
                                {
                                    loading 
                                    ?   <div className="d-flex align-items-center justify-content-center h-100">
                                            <PulseLoader color={'white'}/>
                                        </div>
                                    :
                                    exercises.length
                                    ? exercises.map(el => 
                                        <div className="mini-container m-4 row p-3" key={el._id}>
                                            <div className="col-11 p-0 pr-3">
                                                <h3>{el.description}</h3>
                                                {el.duration} mins.
                                                <br/>
                                                {new Date(el.date).toDateString()}
                                            </div>
                                            <div className="col-1 p-0 d-flex flex-column justify-content-around align-items-center">
                                                <i 
                                                    className="far fa-edit" 
                                                    data-toggle="modal" 
                                                    data-target="#AddOrEdit" 
                                                    id={el._id} 
                                                    onClick={this.handleEdit}/>
                                                <i 
                                                    className="far fa-trash-alt" 
                                                    id={el._id} 
                                                    onClick={this.confirmDelete}/>
                                            </div>
                                        </div>
                                    )
                                    :   <div className="d-flex align-items-center justify-content-center h-100 text-center text-white">
                                            <p className="lead">
                                                No exercise found. 
                                                <br/>
                                                Add exercise to start tracking your routine.
                                            </p>
                                        </div>
                                }
                            </div>
                            <div className="row m-0 pt-4 bg-dark p-3 row-600">
                                <div className="col-md-6 btn-group">
                                    <button 
                                        onClick={this.handleAdd}
                                        className="btn btn-light" 
                                        data-toggle="modal" 
                                        data-target="#AddOrEdit">Add exercise</button>
                                    <button className="btn btn-danger" onClick={this.confirmDelete}>Delete all</button>
                                </div>
                                <div className="col-md-6 d-flex justify-content-center del-container">
                                    <div className="text-white">
                                        {
                                        successMessage == "Exercise deleted"
                                        ? successMessage
                                        : null
                                        }
                                    </div>
                                    <div className="d-none mt-2" id="confirm-delete">
                                        <button className="btn btn-outline-danger mx-3" onClick={this.handleDelete}>Confirm</button>
                                        <button onClick={this.cancelDelete} className="btn btn-link text-white">Cancel</button>
                                    </div>
                                    <br/>
                                    <br/>
                                </div>
                            </div>
                            <AddOrDelete
                                newSubmit={newSubmit}
                                handleSubmit={
                                    newSubmit
                                    ? this.handleNewSubmit
                                    : this.handleEditSubmit
                                }
                                handleChange={this.handleChange}
                                failureMessage={failureMessage}
                                successMessage={successMessage}
                                duration={duration} 
                                description={description}
                                date={date}
                            />
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;
