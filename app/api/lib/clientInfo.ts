import axios from "axios"
import { version } from "react"

const clientPlatform = "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9"

const clientInfo = async () => {
    const getVersion = await axios.get("https://apis.rtrampox.cloud/v1/val/client/version", {
        headers: {
            "x-api-key": "TPX-5DVYTP2VMEHO4Y7FFO854LP2P67G"
        }
    })
    return {
        version: getVersion.data.version,
        build: getVersion.data.build,
        platform: clientPlatform,
    }
}


export { clientInfo }