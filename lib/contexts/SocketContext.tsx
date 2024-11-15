import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { defaultSocketState, GlobalState } from '../types';

const SocketContext = createContext<{
    data: GlobalState;
    state: 'disconnected' | 'connecting' | 'connected';
    setData: Dispatch<SetStateAction<GlobalState>>;
    emit: (label: string, ...content: unknown[]) => void;
    trigger: (type: string) => void;
} | null>(null);

const socket = io('http://localhost:3001', {
    autoConnect: false,
});

export const SocketProvider = ({ children, onTrigger }: { children: React.ReactNode, onTrigger?: (type: string) => void }) => {
    const [data, setData] = useState<GlobalState>(defaultSocketState);
    const [serverData, setServerData] = useState<GlobalState>(data);
    const [state, setState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

    useEffect(() => {
        if (state === 'connected' && serverData !== data) {
            socket.emit('update', data);
            setServerData(data);
        }
    }, [data, state]);

    useEffect(() => {
        setData(serverData);
    }, [serverData]);

    useEffect(() => {
        setState('connecting');
        socket.connect();

        socket.on('connect', () => {
            setState('connected');
            socket.emit("ready");
        });
        socket.on('disconnect', () => {
            setState('disconnected');
        });

        socket.on('update', (data: GlobalState) => {
            setServerData(data);
        });

        socket.on('trigger', (data: string) => {
            if (onTrigger) onTrigger(data);
        });


        return () => {
            setState('disconnected');
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{
            data, state, setData, emit: (
                label,
                ...content
            ) => socket.emit(label, ...content),
            trigger: (type) => {
                socket.emit("trigger", type);
            },
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = (onTrigger?: (type: string) => void) => {

    const context = useContext(SocketContext);


    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};