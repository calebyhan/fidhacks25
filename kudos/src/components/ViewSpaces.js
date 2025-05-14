import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { getSpaceOrder, spaceOrder } from "../database";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getDatabase, ref, get, child } from "firebase/database";
import "./ViewSpaces.css";

export default function ViewSpaces() {
    const [cookies] = useCookies(['user']);
    const [userSpaces, setUserSpaces] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSpaces() {
            if (cookies.user) {
                const orderedIds = await getSpaceOrder(cookies.user.id);

                const db = getDatabase();
                const dbRef = ref(db);
                const spacesFetched = [];

                for (const id of orderedIds) {
                    const spaceSnapshot = await get(child(dbRef, `spaces/${id}`));
                    if (spaceSnapshot.exists()) {
                        spacesFetched.push({ id: id, ...spaceSnapshot.val() });
                    }
                }

                setUserSpaces(spacesFetched);
            } else {
                navigate("/login");
            }
        }
        fetchSpaces();
    }, [cookies, navigate]);

    const handleGoToSpace = (spaceId) => {
        navigate(`/space/${spaceId}`);
    };

    const handleOnDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(userSpaces);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setUserSpaces(items);

        try {
            await spaceOrder(cookies.user.id, items.map(space => space.id));
            console.log("Order updated!");
        } catch (error) {
            console.error("Failed to update order:", error);
        }
    };

    return (
        <div className="ViewSpacesPage">
            <h2>Your Spaces</h2>
            <p>Drag to reorder! Top 2 will be favorited.</p>

            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="spaces">
                    {(provided) => (
                        <div className="space-list" {...provided.droppableProps} ref={provided.innerRef}>
                            {userSpaces.map((space, index) => (
                                <Draggable key={space.id} draggableId={String(space.id)} index={index}>
                                    {(provided) => (
                                        <div
                                            className={`space-item ${index < 2 ? 'favorite' : ''}`}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            onClick={() => handleGoToSpace(space.id)} // 🔥 MOVE onClick here
                                        >
                                            <div className="space-name">
                                                {space.name}
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
