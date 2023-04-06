import { useEffect, useState } from "react";
import { Form, NavLink, Outlet, useLoaderData, useNavigation, useSubmit } from "react-router-dom";


export default function Root() {
    const { contacts, q } = useLoaderData();
    const navigation = useNavigation();
    let dataFilter = [];
    const [filter, setFilter] = useState(q ? q : '');
    if (contacts.length)
        contacts.forEach(contact => {
            if (contact.first || contact.last)
                if (contact.first.toLowerCase().includes(filter.toLowerCase()) || contact.last.toLowerCase().includes(filter.toLowerCase()))
                    dataFilter.push(
                        <Contact contact={contact} />
                    )
        });
    useEffect(() => {
        document.getElementById('q').value = q;
    })
    return (
        <div id='root'>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={true}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {filter ? dataFilter : <ContactList contacts={contacts} />}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                    {/* <ul>
                        {contacts.length ? 
                            contacts.map(contact => {
                                <li key={contact.id}>
                                    <Link to={`contacts/${contact.id}`}>
                                        {contact.first || contact.last ? <i>{contact.first} {contact.last}</i> : <i>No name</i>}
                                    </Link>
                                </li>
                            }) : 
                           <li> <p><i>No contacts</i></p></li>
                        }
                    </ul> */}
                </nav>
            </div>
            <div id="detail"
                className={navigation.state === 'loading' ? 'loading' : ''} >
                <Outlet />
            </div>
        </div>
    );
}

function Contact({ contact }) {
    return (
        <li key={contact.id}>
            <NavLink to={`contacts/${contact.id}`}
                className={({ isActive, isPending }) =>
                    isActive ? 'active' :
                        isPending ? 'pending' : ''}>
                {contact.first || contact.last ? (
                    <>
                        {contact.first} {contact.last}
                    </>
                ) : (
                    <i>No Name</i>
                )}{" "}
                {contact.favorite && <span>★</span>}
            </NavLink>
        </li>
    )
}

function ContactList({ contacts }) {
    return (
        contacts.map(contact =>
            <Contact contact={contact} />)
    )
}
