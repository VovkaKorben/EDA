import React, { useRef, useEffect, useState } from 'react';
import Controls from './component/Controls';
import SchemaCanvas from './component/SchemaCanvas';
import Library from './component/Library';
import './App.css'
import { API_URL } from './helpers/utils.js';
import { getPrimitiveBounds, expandBounds } from './helpers/geo.js';



function App() {
    const [libElements, setElems] = useState(JSON.parse(localStorage.getItem('libElements')) || []);
    const [schemaElements, setSchemaElements] = useState(JSON.parse(localStorage.getItem('schemaElements')) || []);

    // actions itself
    const LoadElems = async () => {
        const resp = await fetch(`${API_URL}library`);

        const result = await resp.json();
        if (resp.ok && result.success) {
            const elem_data = result.data.map((e) => {

                // explode primitives to objects
                const parsedGroups = [];
                let bounds = [Infinity, Infinity, -Infinity, -Infinity];
                if (e.turtle) {
                    const primitiveGroup = [...e.turtle.matchAll(/([A-Z])\((.*?)\)/gim)]

                    // split each primitive to CODE + PARAMS
                    for (const prim of primitiveGroup) {
                        const parsedPrim = {
                            code: prim[1].toUpperCase(),
                            params: prim[2].split(',').map((i) => parseFloat(i))
                        };
                        console.log(e.name, parsedPrim);
                        parsedGroups.push(parsedPrim);
                    }

                    // calc bounds
                    for (const prim of parsedGroups) {
                        const primBounds = getPrimitiveBounds(prim);
                        bounds = expandBounds(bounds, primBounds);
                    }
                }

                // explode epins to coords
                const epins = (e.epins || '').split(';').map((v) => v.split(',').map((c) => parseFloat(c)));

                const result =
                {
                    ...e,
                    turtle: parsedGroups,
                    epins: epins,
                    bounds: bounds
                };
                return result;

            });
            setElems(elem_data);
        }
    }
    useEffect(() => {
        localStorage.setItem('libElements', JSON.stringify(libElements));
    }, [libElements]);

    useEffect(() => {
        localStorage.setItem('schemaElements', JSON.stringify(schemaElements));
    }, [schemaElements]);

    // buttons processing
    const handleAction = (actionId) => {
        switch (actionId) {
            case 1: LoadElems(); break;
        }
    }

    const handleElementDropped = (elementData, x, y) => {
        const newElement = {
            id: Date.now(), // Уникальный ID
            type: elementData.name,
            x: x,
            y: y,
            // Тут можно добавить дефолтные параметры (поворот и т.д.)
        };
        console.log(newElement);
        setSchemaElements([...schemaElements, newElement]);
    };

    return (
        <>


            <div className="header"></div>
            <div className="control-bar">  <Controls onAction={handleAction} /></div>
            <div className="library">
                <Library
                    elems={libElements}
                />
            </div>
            <div className="elem-schema"></div>
            <div className="schema">   <SchemaCanvas
                // onWheel={handleWheel}
                elements={schemaElements}
                onElementDropped={handleElementDropped}
            /></div>





        </>
    )
}

export default App
