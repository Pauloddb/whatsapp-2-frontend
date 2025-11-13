import { differenceInDays } from 'date-fns'

export default function DateHeader({ currentId, previousId }) {
    const getDayMessage = (ms) => {
        const difference = differenceInDays(Date.now(), new Date(ms))

        if (difference === 0) {
            return 'Hoje'
        } else if (difference === 1) {
            return 'Ontem'
        } else {
            return `${difference} dias atrás`
        }
    }


    if (!currentId) return null
    if (differenceInDays(currentId, previousId) === 0) return null

    return (
        <div className='flex items-center justify-center h-10 w-16 bg-gray-800 opacity-50 rounded-md'>
            <p>{getDayMessage(currentId)}</p>
        </div>
    )
}