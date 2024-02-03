import { useMutation } from 'convex/react'
import { useState } from 'react'

const useApiMutation = (mutationFunction: any) => {
    const [isLoading, setIsLoading] = useState(false)
    const apiMutation = useMutation(mutationFunction)

    const mutate = async (payload: any) => {
        setIsLoading(true)
        return apiMutation(payload)
            .finally(() => setIsLoading(false))
            .then((result) => {
                return result
            })
            .catch((error) => {
                throw error
            })
    }
    return { mutate, isLoading }
}

export default useApiMutation
