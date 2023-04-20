import { useEffect, useState } from "react";
import { Form, NavLink, Outlet, useLoaderData, useNavigation, useSubmit } from "react-router-dom";


export default function Root() {
    const { contacts, q } = useLoaderData();
    // useNavigation có thuộc tính state biểu thị các trạng thái điều hướng: Idle, loading, submiting
    //      dùng làm điều kiện hiển thỉ, giúp người dùng cảm giác web có phản hồi hơn - Cải thiện UX
    const navigation = useNavigation();

    // Mảng chứa các Component Contact đang được tìm kiếm trên thanh Search Bar
    let dataFilter = [];
    const [filter, setFilter] = useState(q ? q : '');

    // Lọc từng thành phần mảng contacts. Phần tử contact nào thỏa điều kiện sẽ đc thêm vào mảng 'dataFilter' dưới dạng Component và hiển thị
    if (contacts.length)
        contacts.forEach(contact => {
            if (contact.first || contact.last)
                if (contact.first.toLowerCase().includes(filter.toLowerCase()) || contact.last.toLowerCase().includes(filter.toLowerCase()))
                    dataFilter.push(
                        <Contact contact={contact} />
                    )
        });
    // Sau khi React render, giá trị trên thanh Search Bar sẽ đc giữ lại để đồng bộ vs kết quả tìm kiếm
    useEffect(() => {
        document.getElementById('q').value = q;
    });
    return (
        <div id='root'>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    {/* Sử dụng <Form> của 'react-router-dom' sẽ chặn việc gửi httpRequest khi submit dữ liệu, 
                            trang sẽ ko bị load lại, httpRequest sau đó sẽ đc gửi đi qua action, 
                            dữ liệu trả về  sẽ đc render lại */}
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
                        
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {/* Nếu giá trị trong Search Bar != '' thì hiển thị giá trị đc tìm kiếm, cò ko thì hiển thị toàn bộ các contact */}
                            {filter ? dataFilter : <ContactList contacts={contacts} />}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            {/* Nếu useNavvigation().state = 'loading' thì phần hiển thị Outlet sẽ bị mờ đi */}
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
