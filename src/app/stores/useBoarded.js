import { useState } from "react";
import useStorage from '../../utils/hooks/useStorage';
const storage = useStorage()

export default () => {
    const [boarded, setBoarded] = useState(false)

    const SESSION = '@Session:OnBoarded06';

    const setOnBoard = async (v = true) => {
        setBoarded(v)
        await storage.save(SESSION, v);
    }

    const getOnBoard = async () => {
        const v = await storage.get(SESSION);
        setBoarded(v ? true : false)
        return v ? true : false
    }

    return {
        boarded,
        setOnBoard,
        getOnBoard,
    }
}
