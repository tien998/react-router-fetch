import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Root, {action, loader as rootLoader} from './routes/root';
import ErrorPage from './error-page';
import Contact, { loader as contactLoader } from './routes/contact';
import { createContact, deleteContact, getContact, updateContact } from './contacts';
import EditContact from './routes/edit';
import Index from './routes/Index';





const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: async () => {
      const contact = await createContact();
      return redirect(`/contacts/${(await contact).id}/edit`)
    },
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: "/contacts/:contactId",
        element: <Contact />,
        loader: async ({params}) => {
          return await getContact(params.contactId) 
        },
      },
      {
        path: "/contacts/:contactId/edit",
        element: <EditContact />,
        loader: async ({params}) => {
          return await getContact(params.contactId)
        },
        action: async ({params, request}) => {
          const update = Object.fromEntries(await request.formData());
          await updateContact(params.contactId, update);
          console.log(update);
          return redirect(`/contacts/${params.contactId}`)
        }
      },
      {
        path: `/contacts/:contactId/destroy`,
        action: async ({params}) => {
          // throw new Error(`Oh dang`)
          await deleteContact(params.contactId);
          return redirect(`/`)
        },
        errorElement: <ErrorPage/>
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

