import { useCallback } from 'react';
import { Handle } from 'reactflow';

function AttributeNode({ data }) {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
      }, []);
    return (
        <div className="attribute-node">
            <label htmlFor="attribute">Attribute:</label>
            <input 
                id="attribute" 
                name="attribute" 
                onChange={onChange}
                className="nodrag" 
                onMouseDown={(e) => e.stopPropagation()} 
            />
            <Handle 
                type="source"
                position="bottom"
                style={{ background: '#555' }}
            />
        </div>
    );
}

export default AttributeNode;
