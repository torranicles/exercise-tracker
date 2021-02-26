import React from 'react'
import '../styles/Dashboard.css'
import axios from 'axios'
import Loader from './Loader'
import AddOrDelete from './AddOrDelete'

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            duration: '',
            date: '',
            _id: null,
            newSubmit: null,
            message: null,
            loading: true,
            exercises: [],
            updates: []
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.handleNewSubmit = this.handleNewSubmit.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
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
                updates: res.data.log
            })
        })
    }

    handleEditSubmit(e) {
        console.log(this.state._id)
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
            if (res.data == "Exercise edited") {
                this.setState({
                    message: res.data
                });
                this.getExercises()
            }
        })
    }

    handleAdd() {
        this.setState({
            newSubmit: true
        })
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
                console.log(res)
                if (res.data == "Exercise deleted") {
                    this.setState({
                        message: res.data
                    });
                    this.getExercises();
                }
                setTimeout(() => {
                    this.setState({
                        message: null
                    })
                }, 2000);
                document.getElementById('confirm-delete')
                    .classList.add('d-none');
            })
    }

    handleLogout() {
         //TODO : Transfer logic to server
        axios.get('/logout')
            .then(res => {
                if (res.data == "Logged out") {
                    this.props.history.push('/');
                    sessionStorage.clear();
                }
            })
            .catch(err => {
                console.log(err)
            })
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
                if (res.data.message) {
                    this.getExercises();
                    this.setState({
                        message: res.data.message
                    })
                }
            })
            .catch(err => console.log("Add error", err))
    }

    getExercises() {
        axios.get('/exercise/log')
        .then(res => {
            this.setState({
                exercises: res.data.log,
                loading: false,
            });
        })
    }

    componentDidMount() {
        this.getExercises();
    }

    render() {
        const {newSubmit, loading, message, exercises, updates} = this.state;
        console.log(newSubmit)
        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-dark">
                    <a className="navbar-brand" href="#">Exercise Tracker</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse flex-row-reverse" id="collapsibleNavbar">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button onClick={this.handleLogout} className="btn btn-link text-white">Logout</button>
                            </li>
                        </ul>
                    </div>  
                </nav>
                <br/>
                <div className="container-md w-50 view-container d-flex justify-content-center">
                    <div className="container-md w-100 bg-light p-0">
                            <div className="container-md justify-content-center flex-column w-100 bg-dark data-container" style={{overflowY: "auto"}}>
                                {
                                    loading 
                                    ? <Loader/>
                                    :
                                    exercises
                                    ? exercises.map(el => 
                                        <div className="mini-container mx-1 my-3 row p-3" key={el._id}>
                                            <div className="col-md-10 p-0">
                                                <h3>Description: {el.description}</h3>
                                                Duration: {el.duration}
                                                <br/>
                                                Date: {el.date}
                                            </div>
                                            <div className="col-md-2 p-0">
                                                <i 
                                                    className="far fa-trash-alt" 
                                                    id={el._id} 
                                                    onClick={this.confirmDelete}/>
                                                <i 
                                                    className="far fa-edit" 
                                                    data-toggle="modal" 
                                                    data-target="#AddOrEdit" 
                                                    id={el._id} 
                                                    onClick={this.handleEdit}/>
                                            </div>
                                        </div>
                                    )
                                    : null
                                }
                            </div>
                            <div className="row m-0 pt-4 pl-3">
                                <div className="col-md-6 btn-group">
                                    <button 
                                        onClick={this.handleAdd}
                                        className="btn btn-dark" 
                                        data-toggle="modal" 
                                        data-target="#AddOrEdit">Add exercise</button>
                                    <button className="btn btn-danger" onClick={this.confirmDelete}>Delete all</button>
                                </div>
                                <div className="col-md-6">
                                    <div>
                                        {
                                            message
                                            ? message
                                            : null
                                        }
                                    </div>
                                    <div className="d-none" id="confirm-delete">
                                        <button className="btn btn-outline-danger" onClick={this.handleDelete}>Delete</button>
                                        <span>Cancel</span>
                                    </div>
                                </div>
                            </div>
                            <AddOrDelete
                                header={
                                    newSubmit
                                    ? "New exercise"
                                    : "Edit exercise"
                                }
                                handleSubmit={
                                    newSubmit
                                    ? this.handleNewSubmit
                                    : this.handleEditSubmit
                                }
                                handleChange={this.handleChange}
                                message={message}
                                duration={updates.map(e => e.duration)} //Can be improved?
                                description={updates.map(e => e.description)}
                                date={updates.map(e => e.date)}
                            />
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;
