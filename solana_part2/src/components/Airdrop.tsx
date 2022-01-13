import { Connection, PublicKey, clusterApiUrl, RpcResponseAndContext, SignatureResult } from "@solana/web3.js";
import { FC, useEffect, useState } from "react";

interface AirdropProps {
    pubkey: PublicKey;
}

const network = "devnet";

const Airdrop: FC<AirdropProps> = ({pubkey}) => {

    const [ publickey ] = useState<string>(pubkey.toBase58());
    const [ lamports, setLamports ] = useState(100000);
    const [ txid, setTxid ] = useState<string | null>(null);
    const [ slot, setSlot ] = useState<number | null>(null);
    const [ balance, setBalance ] = useState(0);

    // Retrieve the balance when mounting the component
    useEffect( () => {
        const connection = new Connection(clusterApiUrl(network));
        connection.getBalance(pubkey).then(setBalance);
    }, []);


    function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        const connection = new Connection(clusterApiUrl(network));
        pubkey && connection.requestAirdrop(pubkey, lamports)
        .then((id: string) => { 
            console.log(`Transaction ID ${id}`);
            setTxid(id);
            connection.confirmTransaction(id)
            .then((confirmation: RpcResponseAndContext<SignatureResult>) => {
                console.log(`Confirmation slot: ${confirmation.context.slot}`);
                setSlot(confirmation.context.slot);
                connection.getBalance(pubkey).then(setBalance);
            });
        })
        .catch(console.error);
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLamports(parseInt(event.target.value));
    }

    return (
        <div>
            <p className="p15">&nbsp;</p>
            <form onSubmit={handleSubmit}>
                <label>Public Key to receive airdrop</label><br/>
                <input type="text" readOnly={true} value={publickey} className="input-text"  /><br/>
                <label>Lamports to request</label><br/>
                <input type="number" value={lamports} onChange={handleChange} className="input-text" /><br/>
                <input type="submit" value="Request airdrop" className="input-submit" />
            </form>
            <p className="p15">&nbsp;</p>
            <hr/>
            { txid ? <p>Transaction: {txid}</p> : null }
            { slot ? <p>Confirmation slot: {slot}</p> : null }
            <hr/>
            <p>Your current balance is: {balance}</p>
        </div>
        );
}

export default Airdrop;
