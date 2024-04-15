import axios from 'axios'
const baseUrl = '/api/persons/'

const getAll = () => {
    return axios.get(baseUrl)
}

const create = newObject => {
    return axios.post(baseUrl, newObject)
}

const remove = id => {
    return axios.delete(`${baseUrl}${id}`)
}

const update = (updatedObject, id) => {
    return axios.put(`${baseUrl}${id}`, updatedObject)
}

export default { getAll, create, remove, update }