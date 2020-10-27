import React, {Fragment, useState} from 'react';
import {connect} from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '../../../../components/controls/TextBox';
import TextBox from '../../../../components/controls/TextBox';
import {IconButton} from '../../../../components/controls/Button';
import {SaveButton} from '../../../../components/controls/Button';
import SubTopicIcon from '../../../../components/controls/SubTopic';
import {editSupportingItem} from "../../../../actions/supportingItem";
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    icon: {
        color: 'dimgrey',
        marginRight: '30px',
        marginTop: '5px'
    },
    title: {
        marginRight: '20px'
    }
})


const Editable = ({children, onEditClick, onDeleteClick, canEdit = true, canDelete = true, icons}) => (
    <Fragment>
        {!icons ? <span> 
            {canEdit && <IconButton onClick={onEditClick}> <EditIcon /> </IconButton>}
            {canDelete && <IconButton onClick={onDeleteClick}> <DeleteIcon /> </IconButton>}
        </span>
        : icons}
    </Fragment>
)

const SubTopic = ({topicID, _id, title, type, description, ownerID, meetingID, update, canEdit, canDelete = true, onDeleteClick}) => {

    const [edit, setEdit] = useState(canEdit === null ? null : false);
    const [sTitle, setTitle] = useState(title);
    const [sDescription, setDescription] = useState(description);
    const [pending, setPending] = useState(false);
    const classes = useStyles(); 

    function onEditClick() {
        setEdit(true);
        setTitle(title);
        setDescription(description);
    }

    async function editSubTopic() {
        try {
            setPending(true);
            let updated = {};
            if(title !== sTitle) updated.title = sTitle;
            if(description !== sDescription) updated.description = sDescription;
            await update(meetingID, topicID, _id, type, ownerID, updated);
            setEdit(false);
        }
        catch(err) {
            console.warn(err);
        }
        setPending(false);
    }

    return (
        <Fragment>   
            <div>
                {edit ? 
                    <Fragment>     
                        <SubTopicIcon />
                        <div>
                            <TextBox label="Title" name="title" inputProps={{maxLength: 30}} value={sTitle} onChange={(e) => setTitle(e.target.value)} />
                            <TextField label="Description" name="description" fullWidth multiline rows="3" value={sDescription} onChange={(e) => setDescription(e.target.value)} />
                            <SaveButton color="primary" isLoading={pending} onClick={editSubTopic} />
                        </div>
                    </Fragment>
                :
                    <Fragment>
                        <SubTopicIcon className={classes.icon} /> 
                        <span className={classes.title}> {title} </span> 
                        <span> {description} </span>
                        <span>
                            <Editable canEdit={edit === null} onEditClick={edit === null ? () => {} : onEditClick}
                                    canDelete={canDelete} onDeleteClick={onDeleteClick}
                                icons={ 
                                    <Fragment>
                                        <IconButton onClick={onEditClick}> <EditIcon /> </IconButton>
                                        <IconButton onClick={onDeleteClick}> <DeleteIcon /> </IconButton>
                                    </Fragment>
                                } 
                            />
                        </span>
                    </Fragment>
                }                
            </div>
        </Fragment>
    )
}

const mapDispatchToProps = dispatch => ({
    update: (mID, id, suptngItem, updated) => dispatch(editSupportingItem(mID, id, suptngItem, updated))     
})

export default connect(null, mapDispatchToProps)(SubTopic);