import { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

const Canvas = ({ draw, width, height }) => {

    const canvas = useRef();

    useEffect(() => {                             
        const current = canvas.current
        draw(current)
    }, [draw]);

    return (
        <canvas
        ref={canvas} 
        width={width}
        height={height}
        />
    )
};

Canvas.propTypes = {
    draw: PropTypes.func.isRequired,
};

export default Canvas