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
                                    value={
                                        !props.newSubmit
                                        ? new Date(props.date).toLocaleDateString()
                                        : "yyyy-mm-dd"
                                        }
                                        />
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        {
                            props.message 
                            ? <div className="float-left"><span>{props.message}</span></div>
                            : null
                        } 
                        <button type="button" className="btn btn-outline-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddOrDelete;