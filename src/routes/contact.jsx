import { Form, useFetcher, useLoaderData } from "react-router-dom";


export default function Contact() {
  // const contact = {
  //   first: "Your",
  //   last: "Name",
  //   avatar: "https://placekitten.com/g/200/200",
  //   twitter: "your_handle",
  //   notes: "Some notes",
  //   favorite: true,
  // };

  const contact = useLoaderData();

  return (
    <div id="contact">
      {/* {console.log('src: ', contact.avatar)} */}
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || null}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
          // onSubmit={(event) => {
          //   if (
          //     !confirm(
          //       "Please confirm you want to delete this record."
          //     )
          //   ) {
          //     event.preventDefault();
          //   }
          // }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {

  // Lấy giá trị favorite từ { contact }
  //  rồi tạo cho button giá trị ngược lại
  let favorite = contact.favorite;
  
  // Dựa vào giá trị favorite gửi vào request qua đối tượng 'formData'
  //  trả về giao diện UI kết quả như thể request đã hoàn thành
  //  => Khiến người dùng cảm thấy web hoạt động nhanh ngay lập tức

  // fetcher.formData.get('favorite') === 'true' sẽ trả về boolen 'true' hoặc 'false'
  const fetcher = useFetcher();
  if (fetcher.formData) {
    favorite = fetcher.formData.get('favorite') === 'true'
  }
  
  return (
    <fetcher.Form method="PUT">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {/* Hiển thị UI favorite 'có' hoặc 'ko' */}
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}