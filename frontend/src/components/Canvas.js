import { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

const Canvas = ({draw}) => {

    const canvas = useRef();

    useEffect(() => {                             
        const current = canvas.current
        draw(current)
    });

    return (
        <canvas
        ref={canvas} 
        width="100"
        height="100"
        />
    )
};

Canvas.propTypes = {
    draw: PropTypes.func.isRequired,
};

export default Canvas