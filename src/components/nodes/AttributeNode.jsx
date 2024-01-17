import React, { useState, useCallback, useEffect} from 'react';
import { Handle } from 'reactflow';


function AttributeNode({ data }) {
    const [attributes, setAttributes] = useState([{ name: '', value: '' }]);

    const onNameChange = useCallback((index, evt) => {
        const newAttributes = [...attributes];
        newAttributes[index].name = evt.target.value;
        setAttributes(newAttributes);
    }, [attributes]);

    const onValueChange = useCallback((index, evt) => {
        const newAttributes = [...attributes];
        newAttributes[index].value = evt.target.value;
        setAttributes(newAttributes);
    }, [attributes]);

    const addAttribute = () => {
        setAttributes([...attributes, { name: '', value: '' }]);
    };

    return (
        <div className="attribute-node">
            {attributes.map((attribute, index) => (
                <div key={index}>
                    <label htmlFor={`attributeName${index}`}>Field:</label>
                    <input 
                        id={`attributeName${index}`} 
                        value={attribute.name}
                        onChange={evt => onNameChange(index, evt)}
                        className="nodrag" 
                        onMouseDown={(e) => e.stopPropagation()} 
                    />
                    <label htmlFor={`attributeValue${index}`}>Value:</label>
                    <input 
                        id={`attributeValue${index}`} 
                        value={attribute.value}
                        onChange={evt => onValueChange(index, evt)}
                        className="nodrag" 
                        onMouseDown={(e) => e.stopPropagation()} 
                    />
                </div>
            ))}
            <button onClick={addAttribute}>Add Attribute</button>
            <Handle 
                type="source"
                position="bottom"
                style={{ background: '#555' }}
            />
        </div>
    );
}

export default AttributeNode;
