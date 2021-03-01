const AddOrDelete = (props) => {
    return (
        <div className="modal fade" id="AddOrEdit">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">
                            {
                                props.newSubmit
                                ? "New exercise"
                                : "Edit exercise"
                            }
                        </h4>
                        <button type="button" className="close" data-dismiss="modal">×</button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={props.handleSubmit} id="form">
                            <div className="form-group p-1">
                                <label for="description">Description:</label>
                                <input onChange={props.handleChange} 
                                    type="text" 
                                    name="description" 
                                    className="form-control"
                                    required
                                    value={
                                        !props.newSubmit
                                        ? props.description
                                        : null
                                    }
                                />
                            </div>
                            <div className="form-group p-1">
                                <label for="duration">Duration:</label>
                                <input onChange={props.handleChange} 
                                    type="text" 
                                    name="duration" 
                                    className="form-control" 
                                    placeholder="minutes"
                                    required
                                    value={
                                        !props.newSubmit 
                                        ? props.duration
                                        : null
                                    }
                                    />
                            </div>
                            <div className="form-group p-1">
                                <label for="date">Date:</label>
                                <input onChange={props.handleChange} 
                                    type="text" 
                                    name="date" 
                                    className="form-control" 
                                    placeholder="yyyy-mm-dd"
                                    value={
                                        !props.newSubmit 
                                        ? props.date.slice(0,10)
                                        : null
                                    }
                                /> 
                                {/* Value for date */}
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                    <div className="p-3">
                        <span className="float-left text-success">
                            {props.successMessage}
                        </span>
                        <span className="float-left text-danger">
                            {props.failureMessage}
                        </span>
                        <button type="button" className="btn btn-outline-secondary float-right" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddOrDelete;