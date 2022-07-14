import React, { useState, useEffect } from 'react'
import { Form, Modal } from 'react-bootstrap'
import { createBrowserHistory } from 'history'

const FlagModal = ({ show, flagID, onHide, authTokens, isCurrentlyFlagged, hasFlexizyme }) => {

    let [text, setText] = useState("")

    let [flex, setFlex] = useState(false)
    let [mon, setMon] = useState(false)
    let [rib, setRib] = useState(false)
    let [synth, setSynth] = useState(false)
    let [refs, setRefs] = useState(false)
    let [other, setOther] = useState(false)

    const handleFlagging = async () => {
        let message = []
        if (!isCurrentlyFlagged) {
            let reasons = [
                'Monomer information', 
                'Flexizyme (includes Microhelix Assay results)',
                'Synthetase information',
                'Ribosome information',
                'References',
                'Other reaction parameters'
            ]
            let overlap = [mon, flex, synth, rib, refs, other]
            for (let i=0; i < reasons.length; i += 1) {
                if (overlap[i] === true) {
                    message.push(reasons[i])
                }
            }
            if (message.length === 0) {
                setText("Please select a reason from the above choices.")
                return;
            } 
        }

        let response = await fetch(`/api/flags/${flagID}/`, {
                method: 'put',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({
                    "id": flagID,
                    "flagged": !isCurrentlyFlagged,
                    "message": (!isCurrentlyFlagged ? message.join(", ") : null)
                })
            })
            .catch((error) => {
                console.error(error);
            })

        if (response.ok) {
            if (isCurrentlyFlagged) {
                alert("Successfully removed flag.")
            } else {
                alert("Successfully flagged reaction for revision.")
            }
            window.location.reload()
        } else {
            setText(`Error ${isCurrentlyFlagged ? "removing flag from" : "flagging"} reaction.` + await response.text())
        }
    }

    useEffect(() => {
        if (!show) {
            setText("")
        }
    }, [show])

    if (isCurrentlyFlagged) {
        return (
        <Modal show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={onHide} >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Unflag this reaction
                </Modal.Title>
            </Modal.Header>
          <Modal.Body>
            <p>
                This will remove the flag from this reaction. 
                Please confirm that the reaction information is all correct before submitting.
            </p>
            {text !== "" ? <p style={{color:'maroon'}}>{text}</p> : <></>}
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-outline-danger' 
                    onClick={onHide}>
                Cancel
            </button>
            <button className='btn btn-outline-success' 
                    onClick={handleFlagging}>
                Submit (remove flag)
            </button>
          </Modal.Footer>
        </Modal>
        )
    }


    return (
        <Modal show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={onHide} >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Flag this reaction?
                </Modal.Title>
            </Modal.Header>
          <Modal.Body>
            <p>
                This will notify other researchers that this data may be inaccurate and should be revised.
                You can sort out flagged results in the advanced search page.
            </p>
            <p>
                Please check any of the following sections that should be reviewed:
            </p>
            <Form className='mx-2'>
                <Form.Check 
                    type='checkbox'
                    label='Monomer information'
                    onClick = {() => setMon(!mon)}
                />
                <Form.Check 
                    type='checkbox'
                    label={hasFlexizyme ? 
                        'Flexizyme (includes Microhelix Assay results)' : 
                        'Synthetase information'}
                    onClick = {() => hasFlexizyme ? setFlex(!flex) : setSynth(!synth)}
                />
                <Form.Check 
                    type='checkbox'
                    label='Ribosome information'
                    onClick = {() => setRib(!rib)}
                />
                <Form.Check 
                    type='checkbox'
                    label='References'
                    onClick = {() => setRefs(!refs)}
                />
                <Form.Check 
                    type='checkbox'
                    label='Other reaction parameters'
                    onClick = {() => setOther(!other)}
                />
            </Form>
            {text !== "" ? <p style={{color:'maroon'}}>{text}</p> : <></>}
          </Modal.Body>
          <Modal.Footer>
            <button className='btn btn-outline-danger' 
                    onClick={onHide}>
                Cancel
            </button>
            <button className='btn btn-outline-success' 
                    onClick={handleFlagging}>
                Flag this reaction
            </button>
          </Modal.Footer>
    </Modal>
    )
}

export default FlagModal