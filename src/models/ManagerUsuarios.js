import fs from 'fs/promises';

    class ManagerUsuarios {
    constructor() {
        this.path = 'package.json';
    }

    async crearUsuario(usuario) {
        try {
        const packageData = await this.getPackageData();

        if (!packageData.usuarios) {
            packageData.usuarios = [];
        }

        if (!usuario.nombre || !usuario.email || !usuario.password) {
            throw new Error('Los campos "nombre", "email" y "password" son obligatorios.');
        }

        packageData.usuarios.push(usuario);
        await this.savePackageData(packageData);
        console.log('Usuario creado exitosamente.');
        } catch (error) {
        console.error('Error al crear el usuario:', error);
        }
    }

    async consultarUsuarios() {
        try {
        const packageData = await this.getPackageData();
        const usuarios = packageData.usuarios || [];
        console.log('Usuarios:', usuarios);
        } catch (error) {
        console.error('Error al consultar los usuarios:', error);
        }
    }

    async getPackageData() {
        try {
        const data = await fs.readFile(this.path);
        return JSON.parse(data);
        } catch (error) {
        if (error.code === 'ENOENT') {
            return { usuarios: [] };
        } else {
            throw error;
        }
        }
    }

    async savePackageData(data) {
        try {
        await fs.writeFile(this.path, JSON.stringify(data, null, 2));
        } catch (error) {
        throw new Error('Error al guardar los datos en el archivo:', error);
        }
    }
    }

    export default ManagerUsuarios;