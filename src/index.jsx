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
import { createContact, deleteContact, getContact, getContacts, updateContact } from './contacts';
import EditContact from './routes/edit';
import Index from './routes/Index';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: loader,
    action: createAction,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: "/contacts/:contactId",
        element: <Contact />,
        loader: idDependedLoader,
      },
      {
        path: "/contacts/:contactId/edit",
        element: <EditContact />,
        loader: idDependedLoader,
        action: edit
      },
      {
        path: `/contacts/:contactId/destroy`,
        action: destroy,
        errorElement: <ErrorPage />
      }
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);




// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals



// async function loader() {
//   return await getContacts();
// }

async function loader({request}) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const contacts = await getContacts(q);
  return {contacts, q};
}

async function createAction() {
  const contact = await createContact();
  return redirect(`/contacts/${(await contact).id}/edit`)
}

async function idDependedLoader({ params }) {
  return await getContact(params.contactId)
}

async function edit({ params, request }) {
  const update = Object.fromEntries(await request.formData());
  await updateContact(params.contactId, update);
  console.log(update);
  return redirect(`/contacts/${params.contactId}`)
}

async function destroy({ params }) {
  // throw new Error(`Oh dang`)
  await deleteContact(params.contactId);
  return redirect(`/`)
}