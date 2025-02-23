import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import Draggable from "react-draggable";
import { getAuditoriumType } from "../../scripts/utils/auditoriumUtils";
import { Stairs, Elevator, RestRoom } from "./MapElements";

export const FloorSelector = ({
    currentFloor,
    onFloorChange,
    maxFloor = 5,
}) => {
    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg border border-gray-200 p-2">
            <div className="flex flex-col gap-2">
                {[...Array(maxFloor)].map((_, index) => {
                    const floor = maxFloor - index;
                    return (
                        <button
                            key={floor}
                            onClick={() => onFloorChange(floor)}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-medium transition-all
                                ${
                                    currentFloor === floor
                                        ? "bg-purple-600 text-white"
                                        : "text-gray-600 hover:bg-purple-50"
                                }`}
                        >
                            {floor}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default function InteractiveMap({
    auditoriums,
    selectedAuditorium,
    onAuditoriumSelect,
    currentFloor = 1,
    isEditing = false,
    onPositionChange,
    mapElements = [],
    onMapElementAdd,
    onMapElementMove,
    onMapElementDelete,
}) {
    const [positions, setPositions] = useState({});
    const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [showGrid, setShowGrid] = useState(false);
    const [selectedElements, setSelectedElements] = useState([]);
    const nodeRefs = useRef({});
    const mapRef = useRef(null);

    const floorAuditoriums =
        auditoriums?.filter((a) => a.floor === currentFloor) || [];
    const floorElements = mapElements.filter((e) => e.floor === currentFloor);

    floorAuditoriums.forEach((auditorium) => {
        if (!nodeRefs.current[auditorium.id]) {
            nodeRefs.current[auditorium.id] = React.createRef();
        }
    });

    const handleDragStop = (auditorium, e, data) => {
        if (onPositionChange) {
            onPositionChange(auditorium.id, {
                position_x: data.x,
                position_y: data.y,
            });
        }
    };

    const handleMapElementDragStop = (element, e, data) => {
        if (onMapElementMove) {
            onMapElementMove(element.id, {
                position_x: data.x,
                position_y: data.y,
            });
        }
    };

    const handleWheel = (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            const delta = e.deltaY * -0.01;
            const newScale = Math.min(Math.max(0.5, scale + delta), 2);
            setScale(newScale);
        } else {
            const newX = mapPosition.x - e.deltaX;
            const newY = mapPosition.y - e.deltaY;
            setMapPosition({ x: newX, y: newY });
        }
    };

    const addMapElement = (type) => {
        if (onMapElementAdd) {
            onMapElementAdd({
                type,
                floor: currentFloor,
                position_x: 100,
                position_y: 100,
            });
        }
    };

    const formatScale = (scale) => `${Math.round(scale * 100)}%`;

    return (
        <div className="relative">
            {/* Легенда и панель инструментов */}
            <div className="mb-4 flex justify-between items-start">
                <div className="flex gap-4">
                    {isEditing && (
                        <div className="flex gap-2 bg-white p-2 rounded-lg border border-gray-200">
                            <button
                                onClick={() => addMapElement("stairs")}
                                className="p-2 hover:bg-gray-100 rounded"
                                title="Добавить лестницу"
                            >
                                <Icon icon="mdi:stairs" className="text-xl" />
                            </button>
                            <button
                                onClick={() => addMapElement("elevator")}
                                className="p-2 hover:bg-gray-100 rounded"
                                title="Добавить лифт"
                            >
                                <Icon icon="mdi:elevator" className="text-xl" />
                            </button>
                            <button
                                onClick={() => addMapElement("restroom")}
                                className="p-2 hover:bg-gray-100 rounded"
                                title="Добавить туалет"
                            >
                                <Icon
                                    icon="mdi:paper-roll"
                                    className="text-xl"
                                />
                            </button>
                        </div>
                    )}

                    <div className="flex gap-2 bg-white p-2 rounded-lg border border-gray-200">
                        <button
                            onClick={() => setScale(Math.min(scale + 0.1, 2))}
                            className="p-2 hover:bg-gray-100 rounded"
                            title="Увеличить"
                        >
                            <Icon icon="mdi:plus" className="text-xl" />
                        </button>
                        <div className="px-2 flex items-center min-w-[60px] justify-center">
                            {formatScale(scale)}
                        </div>
                        <button
                            onClick={() => setScale(Math.max(scale - 0.1, 0.5))}
                            className="p-2 hover:bg-gray-100 rounded"
                            title="Уменьшить"
                        >
                            <Icon icon="mdi:minus" className="text-xl" />
                        </button>
                        <button
                            onClick={() => {
                                setScale(1);
                                setMapPosition({ x: 0, y: 0 });
                            }}
                            className="p-2 hover:bg-gray-100 rounded"
                            title="Сбросить масштаб"
                        >
                            <Icon icon="mdi:refresh" className="text-xl" />
                        </button>
                        {isEditing && (
                            <button
                                onClick={() => setShowGrid(!showGrid)}
                                className={`p-2 rounded transition-colors ${
                                    showGrid
                                        ? "bg-purple-100 text-purple-600"
                                        : "hover:bg-gray-100"
                                }`}
                                title="Показать/скрыть сетку"
                            >
                                <Icon icon="mdi:grid" className="text-xl" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 bg-white p-2 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded" />
                        <span>Коридор</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white border border-gray-200 rounded" />
                        <span>Аудитория</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:stairs" />
                        <span>Лестница</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:elevator" />
                        <span>Лифт</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:paper-roll" />
                        <span>Туалет</span>
                    </div>
                </div>
            </div>

            <div
                className="relative w-full h-[600px] bg-gray-50 rounded-xl overflow-hidden"
                onWheel={handleWheel}
            >
                {showGrid && (
                    <div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                            `,
                            backgroundSize: "20px 20px",
                            opacity: 0.3,
                            transform: `scale(${scale})`,
                            transformOrigin: "0 0",
                        }}
                    />
                )}

                <div
                    ref={mapRef}
                    className="absolute inset-0 p-6 transition-transform duration-200"
                    style={{
                        transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${scale})`,
                    }}
                >
                    <div className="relative w-full h-full border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="absolute inset-0">
                            <div className="absolute left-1/2 top-0 bottom-0 w-20 -ml-10 bg-gray-100" />
                            <div className="absolute top-1/2 left-0 right-0 h-20 -mt-10 bg-gray-100" />
                        </div>

                        {floorAuditoriums.map((auditorium) => (
                            <Draggable
                                key={auditorium.id}
                                nodeRef={nodeRefs.current[auditorium.id]}
                                disabled={!isEditing}
                                defaultPosition={{
                                    x: auditorium.position_x || 0,
                                    y: auditorium.position_y || 0,
                                }}
                                position={
                                    positions[`auditorium-${auditorium.id}`] ||
                                    null
                                }
                                bounds="parent"
                                grid={[10, 10]}
                                onStop={(e, data) => {
                                    const newPositions = {
                                        ...positions,
                                        [`auditorium-${auditorium.id}`]: {
                                            x: data.x,
                                            y: data.y,
                                        },
                                    };
                                    setPositions(newPositions);
                                    handleDragStop(auditorium, e, data);
                                }}
                            >
                                <button
                                    ref={nodeRefs.current[auditorium.id]}
                                    onClick={() =>
                                        !isEditing &&
                                        onAuditoriumSelect(auditorium)
                                    }
                                    className={`absolute p-2 rounded-lg transition-colors cursor-${
                                        isEditing ? "move" : "pointer"
                                    }
                                        ${
                                            selectedAuditorium?.id ===
                                            auditorium.id
                                                ? "bg-purple-600 text-white shadow-lg"
                                                : "bg-white text-gray-900 shadow-sm hover:shadow-md"
                                        }`}
                                    style={{
                                        width: `${auditorium.width || 120}px`,
                                        height: `${auditorium.height || 120}px`,
                                    }}
                                >
                                    <div className="h-full flex flex-col justify-between">
                                        <div>
                                            <div className="text-sm font-medium">
                                                {auditorium.number}
                                            </div>
                                            <div className="text-xs opacity-75">
                                                {getAuditoriumType(
                                                    auditorium.type
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs">
                                            <Icon
                                                icon="mdi:account-group"
                                                className="text-base"
                                            />
                                            <span>{auditorium.capacity}</span>
                                        </div>
                                    </div>
                                    {isEditing && (
                                        <div className="absolute inset-0 border-2 border-dashed border-purple-300 rounded-lg pointer-events-none" />
                                    )}
                                </button>
                            </Draggable>
                        ))}

                        {floorElements.map((element) => (
                            <Draggable
                                key={element.id}
                                disabled={!isEditing}
                                defaultPosition={{
                                    x: element.position_x || 0,
                                    y: element.position_y || 0,
                                }}
                                position={
                                    positions[`element-${element.id}`] || null
                                }
                                bounds="parent"
                                grid={[10, 10]}
                                onStop={(e, data) => {
                                    const newPositions = {
                                        ...positions,
                                        [`element-${element.id}`]: {
                                            x: data.x,
                                            y: data.y,
                                        },
                                    };
                                    setPositions(newPositions);
                                    handleMapElementDragStop(element, e, data);
                                }}
                            >
                                <div className="absolute group">
                                    {element.type === "stairs" && <Stairs />}
                                    {element.type === "elevator" && (
                                        <Elevator />
                                    )}
                                    {element.type === "restroom" && (
                                        <RestRoom />
                                    )}
                                    {isEditing && (
                                        <>
                                            <div className="absolute inset-0 border-2 border-dashed border-purple-300 rounded-lg pointer-events-none" />
                                            <button
                                                onClick={() =>
                                                    onMapElementDelete(
                                                        element.id
                                                    )
                                                }
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors flex items-center justify-center"
                                                title="Удалить элемент"
                                            >
                                                <Icon
                                                    icon="mdi:close"
                                                    className="text-lg"
                                                />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </Draggable>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
