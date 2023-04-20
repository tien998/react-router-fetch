import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/root';
import ErrorPage from './error-page';
import Contact from './routes/contact';
// import { createContact, deleteContact, getContact, getContacts, updateContact } from './contacts';
import EditContact from './routes/edit';
import Index from './routes/Index';
// import { fireEvent } from '@testing-library/react';

// truyền url của api vào đối tượng để thực hiện fetch data
const url = 'https://643916421b9a7dd5c95e9fed.mockapi.io/contacts';
// const url ='https://localhost:7161/pizza';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: loadContacts,
    action: createAction,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: "/contacts/:contactId",
        element: <Contact />,
        loader: loadContact,
        action: favoriteEdit
      },
      {
        path: "/contacts/:contactId/edit",
        element: <EditContact />,
        loader: loadContact,
        action: editAction
      },
      {
        path: `/contacts/:contactId/destroy`,
        action: destroyAction,
        errorElement: <ErrorPage />
      }
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode >
);

// Các 'loader' và 'action' được khai báo dưới đây
async function GetContacts() {
  return (await (await fetch(url)).json())
}

async function GetContact(id) {
  return (await (await fetch(`${url}/${id}`)).json())
}

// trả về mảng các contacts 
async function loadContacts({ request }) {
  const q = new URL(request.url).searchParams.get('q');
  const contacts = await GetContacts();
  return { contacts, q }
}

// trả về 1 contact dựa trên id 
async function loadContact({ params }) {
  const contact = await GetContact(params.contactId);
  return contact
}

async function createAction() {

  // lấy phần tử cuối cùng bằng slice(-1), truy cập phần tử bằng [0]
  const lastContact = (await GetContacts()).slice(-1)[0];
  let id;
  // Nếu contact ko tồn tại thì id =1
  lastContact ? id = lastContact.id + 1 : id = 1;
  const contact = { id: id, first: 'null', last: 'null', avatar: 'null', twitter: 'null', favorite: false };
  console.log('contact: ', JSON.stringify(contact))
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Chuyển đối tượng js thành json
    body: JSON.stringify(contact)
  });
  return redirect('/')
}

async function editAction({ params, request }) {
  const id = params.contactId;
  const formData = await request.formData();
  const updatedData = JSON.stringify(Object.fromEntries(formData));
  // PUT data bằng fetch
  await fetch(`${url}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: updatedData
  });
  return redirect(`/contacts/${id}`)
}

async function destroyAction({ params }) {
  const id = params.contactId;
  await fetch(`${url}/${id}`, {
    method: 'DELETE',
  });
  return redirect('/')
}

async function favoriteEdit({ params, request }) {
  const id = params.contactId;
  // Truy vấn 1 mảng các contacts rồi tìm phần tử  bằng id
  const contacts = await GetContacts();
  let contact = contacts.find(id => id === id);
  // Lấy giá  trị của favorite đc truyền vào request rồi gán vào contact vừa tìm
  const favorite = (await request.formData()).get('favorite') === 'true';
  contact.favorite = favorite;
  // Update data
  await fetch(`${url}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contact)
  });
  return redirect(`/contacts/${id}`)
}