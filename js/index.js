import {
  getDatabase,
  get,
  ref,
  push,
  onValue,
  remove,
  update,
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js'

const firebaseConfig = {
  /*apiKey: 'AIzaSyApHcE_64KOE_Y052l6Hov0nvE0URHWjL4',
  authDomain: 'helloworld-4132d.firebaseapp.com',
  databaseURL: 'https://helloworld-4132d-default-rtdb.firebaseio.com',
  projectId: 'helloworld-4132d',
  storageBucket: 'helloworld-4132d.appspot.com',
  messagingSenderId: '319619940944',
  appId: '1:319619940944:web:aa44273d0d069c29a38755',*/
  apiKey: 'AIzaSyBMJsVpnbOwVOiVNbTZScZdet9qlGigDL0',
  authDomain: 'conexion-8ec0d.firebaseapp.com',
  databaseURL: 'https://conexion-8ec0d-default-rtdb.firebaseio.com',
  projectId: 'conexion-8ec0d',
  storageBucket: 'conexion-8ec0d.appspot.com',
  messagingSenderId: '679910299749',
  appId: '1:679910299749:web:9800b464879628b4850e8c',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)

const enviar = document.getElementById('btn-enviar')
const miTabla = document.getElementById('miTabla')

const guardar = () => {
  const name = document.getElementById('nombre').value
  const last = document.getElementById('apellido').value
  const email = document.getElementById('mail').value
  const subject = document.getElementById('opciones').value
  const message = document.getElementById('mensaje').value

  push(ref(db, 'Tipanluisa'), {
    nombre: name,
    apellido: last,
    mail: email,
    opciones: subject,
    mensaje: message,
  })
}

enviar.addEventListener('click', guardar)

const mostrarDatosEnTabla = (datos) => {
  miTabla.innerHTML = ''

  datos.forEach((item) => {
    const fila = document.createElement('tr')
    fila.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.apellido}</td>
      <td>${item.mail}</td>
      <td>${item.opciones}</td>
      <td>${item.mensaje}</td>
      <td>
        <button class="button is-danger eliminar" data-key="${item.key}">Eliminar</button>
        <button class="button is-warning modificar" data-key="${item.key}">Modificar</button>
      </td>
    `
    miTabla.appendChild(fila)
  })
}

onValue(ref(db, 'Tipanluisa'), (snapshot) => {
  const datos = []
  snapshot.forEach((childSnapshot) => {
    const key = childSnapshot.key
    const data = childSnapshot.val()
    datos.push({ key, ...data })
  })
  mostrarDatosEnTabla(datos)
})

const eliminarRegistro = (key) => {
  remove(ref(db, `Tipanluisa/${key}`))
}

const obtenerRegistroPorClave = async (key) => {
  try {
    const snapshot = await get(ref(db, `Tipanluisa/${key}`))

    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      console.log('No se encontró el registro con la clave', key)
      return null
    }
  } catch (error) {
    console.error('Error al obtener el registro:', error)
    return null
  }
}

miTabla.addEventListener('click', async (event) => {
  const key = event.target.dataset.key

  if (event.target.classList.contains('eliminar')) {
    eliminarRegistro(key)
  } else if (event.target.classList.contains('modificar')) {
    const registroAModificar = await obtenerRegistroPorClave(key)

    if (registroAModificar) {
      llenarFormulario(registroAModificar)
      agregarBotonGuardarCambios(key)

      console.log('Modificar registro con clave', key)
    } else {
      console.log('No se pudo obtener el registro con clave', key)
    }
  }
})
//Actualizar Datos
const mostrarDatosEnTablaActualizada = async () => {
  try {
    const snapshot = await get(ref(db, 'Tipanluisa'))
    const datos = []

    snapshot.forEach((childSnapshot) => {
      const key = childSnapshot.key
      const data = childSnapshot.val()
      datos.push({ key, ...data })
    })

    mostrarDatosEnTabla(datos)
  } catch (error) {
    console.error('Error al obtener los datos', error)
  }
}

const llenarFormulario = (datos) => {
  document.getElementById('nombre').value = datos.nombre
  document.getElementById('apellido').value = datos.apellido
  document.getElementById('mail').value = datos.mail
  document.getElementById('opciones').value = datos.opciones
  document.getElementById('mensaje').value = datos.mensaje
}

const agregarBotonGuardarCambios = (key) => {
  const botonGuardarCambios = document.createElement('button')
  botonGuardarCambios.classList.add('button', 'is-success')
  botonGuardarCambios.textContent = 'Guardar cambios'
  botonGuardarCambios.addEventListener('click', async () => {
    const nuevosDatos = {
      nombre: document.getElementById('nombre').value,
      apellido: document.getElementById('apellido').value,
      mail: document.getElementById('mail').value,
      opciones: document.getElementById('opciones').value,
      mensaje: document.getElementById('mensaje').value,
    }

    await actualizarRegistro(key, nuevosDatos)

    limpiarFormulario()
    eliminarBotonGuardarCambios()

    await mostrarDatosEnTablaActualizada()

    console.log('Guardar cambios para el registro con clave', key)
  })

  document.querySelector('.field.is-grouped').appendChild(botonGuardarCambios)
}

const actualizarRegistro = (key, nuevosDatos) => {
  update(ref(db, `Tipanluisa/${key}`), nuevosDatos)
}

const limpiarFormulario = () => {
  document.getElementById('nombre').value = ''
  document.getElementById('apellido').value = ''
  document.getElementById('mail').value = ''
  document.getElementById('opciones').value = ''
  document.getElementById('mensaje').value = ''
}

const eliminarBotonGuardarCambios = () => {
  const botonGuardarCambios = document.querySelector('.button.is-success')
  if (botonGuardarCambios) {
    botonGuardarCambios.remove()
  }
}
