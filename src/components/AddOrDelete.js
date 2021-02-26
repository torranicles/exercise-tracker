const AddOrDelete = (props) => {
    return (
        <div className="modal fade" id="AddOrEdit">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">{props.header}</h4>
                        <button type="button" className="close" data-dismiss="modal">×</button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={props.handleSubmit}>
                            <div className="form-group p-1">
                                <label for="description">Description:</label>
                                <input onChange={props.handleChange} 
                                    type="text" 
                                    name="description" 
                                    className="form-control"
                                    placeholder={props.description}
                                />
                            </div>
                            <div className="form-group p-1">
                                <label for="duration">Duration:</label>
                                <input onChange={props.handleChange} 
                                    type="text" name="duration" 
                                    className="form-control" 
                                    placeholder={
                                        props.duration 
                                        ? props.duration 
                                        : "minutes"
                                    }
                                    />
                            </div>
                            <div className="form-group p-1">
                                <label for="date">Date:</label>
                                <input onChange={props.handleChange} 
                                    type="text" 
                                    name="date" 
                                    className="form-control" 
                                    placeholder={
                                        props.date
                                        ? props.date
                                        : "yyyy-mm-dd"
                                        }
                                        />
                            </div>
                            <button type="submit">submit</button>
                        </form>
                    </div>
                    <div className="modal-footer">
                        {props.message ? <span>{props.message}</span> : null} 
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddOrDelete;