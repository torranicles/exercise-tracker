import axios from 'axios'

class Auth {
    constructor() {
        this.authenticated = false;
    }

    login() {
        this.authenticated = true;
    }

    isAuthenticated = async () => {
        const res = await axios.get('/logged_in');
        return res.data.logged_in;
    }
}

export default new Auth();