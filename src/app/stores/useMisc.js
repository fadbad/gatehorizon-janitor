import { useState } from "react";

export default () => {
    const [selectedTab, setSelectedTab] = useState('')

    return {
        selectedTab,
        setSelectedTab,
    }
}
