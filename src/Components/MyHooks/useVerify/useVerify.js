import { useEffect, useState } from "react";


const useVerify = email => {
    const [isVerified, setIsVerified] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(true);

    useEffect(() => {
        fetch(`https://used-books-server.vercel.app/users/verify/${email}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setIsVerified(data.isVerified);
                setVerifyLoading(false);
            })
    }, [email]);
    return [isVerified, verifyLoading];
}

export default useVerify;