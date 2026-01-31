import React, { useRef, useEffect, useState } from 'react';
import Controls from './component/Controls';
import SchemaCanvas from './component/SchemaCanvas';
import ElementsList from './component/ElementsList';
import Library from './component/Library';
import './App.css'
import { API_URL } from './helpers/utils.js';
import { getPrimitiveBounds, expandBounds } from './helpers/geo.js';
import { prettify } from './helpers/debug.js';



function App() {
    const [libElements, setLibElements] = useState(JSON.parse(localStorage.getItem('libElements')) || []);
    const [schemaElements, setSchemaElements] = useState(JSON.parse(localStorage.getItem('schemaElements')) || []);

    // actions itself
    const LoadElems = async () => {
        const resp = await fetch(`${API_URL}library`);
        const result = await resp.json();
        const elem_data = {};

        if (resp.ok && result.success) {
            result.data.forEach((e) => {

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
                        // console.log(e.name, parsedPrim);
                        parsedGroups.push(parsedPrim);
                    }

                    // calc bounds
                    for (const prim of parsedGroups) {
                        const primBounds = getPrimitiveBounds(prim);
                        bounds = expandBounds(bounds, primBounds);
                    }
                }

                // explode pins to coords
                const pins = {};
                const pinsGroup = [...(e.pins || '').matchAll(/(\d+):(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)]
                for (const pin of pinsGroup) {
                    pins[+pin[1]] = [+pin[2], +pin[3]];
                }
                console.log(prettify(pins, 0));

                elem_data[e.id] =
                {
                    ...e,
                    turtle: parsedGroups,
                    pins: pins,
                    bounds: bounds
                };


            });
            setLibElements(elem_data);
        }
    }
    const ClearSchema = () => { setSchemaElements([]) }
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
            case 2: ClearSchema(); break;
        }
    }

    const handleElementDropped = (elementData, x, y) => {
        const newElement = {
            id: Date.now(), // Уникальный ID
            type: elementData.id,
            x: x,
            y: y,
            debug: elementData.name,
            rotate: 0,
            // Тут можно добавить дефолтные параметры (поворот и т.д.)
        };
        console.log(prettify(newElement, 0));
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
            <div className="elem-schema">
                <ElementsList elements={schemaElements} />
            </div>
            <div className="schema">   <SchemaCanvas
                libElements={libElements}
                schemaElements={schemaElements}
                onElementDropped={handleElementDropped}
            /></div>





        </>
    )
}

export default App
