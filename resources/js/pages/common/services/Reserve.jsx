import React, { useState, useEffect, useMemo } from "react";
import { useInteractiveAuditoriums } from "../../../scripts/hooks/useAuditoriumsQueries";
import InteractiveMap, {
    FloorSelector,
} from "../../../components/reserve/InteractiveMap";
import AuditoriumInfoModal from "../../../components/reserve/AuditoriumInfoModal";
import AnimatedLoader from "../../../components/elements/AnimatedLoader";
import MenuLayout from "../../../layouts/MenuLayout";
import { useAuth } from "../../../contexts/AuthContext";
import { useMapElements } from "../../../scripts/hooks/useMapElementsQueries";
import { getAuditoriumType } from "../../../scripts/utils/auditoriumUtils";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
export default function Reserve() {
    const { roles } = useAuth();
    const [currentFloor, setCurrentFloor] = useState(1);
    const [selectedAuditorium, setSelectedAuditorium] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const {
        data: auditoriums,
        isLoading,
        updateAuditorium,
    } = useInteractiveAuditoriums();

    const {
        data: mapElements,
        addMapElement,
        updateMapElement,
        deleteMapElement,
    } = useMapElements();

    const filteredAuditoriums = useMemo(() => {
        if (!auditoriums) return [];

        return searchTerm
            ? auditoriums.filter(
                  (a) =>
                      a.number
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                      getAuditoriumType(a.type)
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
              )
            : auditoriums;
    }, [searchTerm, auditoriums]);

    const handlePositionChange = async (id, position) => {
        try {
            await updateAuditorium.mutateAsync({
                id,
                ...position,
            });
        } catch (error) {
            console.error("Failed to update position:", error);
        }
    };

    const handleMapElementAdd = async (elementData) => {
        try {
            await addMapElement.mutateAsync(elementData);
        } catch (error) {
            console.error("Failed to add map element:", error);
        }
    };

    const handleMapElementMove = async (id, position) => {
        try {
            await updateMapElement.mutateAsync({ id, ...position });
        } catch (error) {
            console.error("Failed to update map element position:", error);
        }
    };

    const handleMapElementDelete = async (id) => {
        try {
            await deleteMapElement.mutateAsync(id);
        } catch (error) {
            console.error("Failed to delete map element:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[600px]">
                <AnimatedLoader className="w-8 h-8" />
            </div>
        );
    }

    return (
        <MenuLayout>
            <div className="container mx-auto p-6">
                <div className="mb-6 flex justify-between items-start">
                    <div>
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Бронирование аудиторий
                            </h1>
                        </div>
                        <div className="mt-2 max-w-md">
                            <input
                                type="text"
                                placeholder="Поиск аудитории..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {roles.isAdmin && (
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    isEditing
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {isEditing
                                    ? "Сохранить расположение"
                                    : "Редактировать расположение"}
                            </button>
                        )}
                        <Link
                            to="/services"
                            className="text-gray-500 hover:text-gray-600
                                    transition-all duration-200 transform
                                    hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center
                                    bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                            >
                                <Icon
                                    icon="mdi:arrow-left"
                                    className="text-xl"
                                />
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="relative">
                    <InteractiveMap
                        auditoriums={filteredAuditoriums}
                        selectedAuditorium={selectedAuditorium}
                        onAuditoriumSelect={setSelectedAuditorium}
                        currentFloor={currentFloor}
                        isEditing={isEditing}
                        onPositionChange={handlePositionChange}
                        mapElements={mapElements}
                        onMapElementAdd={handleMapElementAdd}
                        onMapElementMove={handleMapElementMove}
                        onMapElementDelete={handleMapElementDelete}
                    />
                    <FloorSelector
                        currentFloor={currentFloor}
                        onFloorChange={setCurrentFloor}
                        maxFloor={5}
                    />
                </div>

                {selectedAuditorium && !isEditing && (
                    <AuditoriumInfoModal
                        auditorium={selectedAuditorium}
                        onClose={() => setSelectedAuditorium(null)}
                    />
                )}
            </div>
        </MenuLayout>
    );
}
