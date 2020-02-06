import Record from '../src/models/Record';

describe('Record is a class and can create records', () => {

  const recordData = {
    id: 1,
    title: "Abbey Road",
    artist: "The Beatles",
    genre: "Rock",
    image_url: "www.mock.com/ablum.jpg"
  };

  const r = new Record(recordData);

  test('expects Record to exist', () => {
    expect(typeof Record).toEqual('function')
  });

  test('expects Record to be able to create new records', () => {
    expect(r instanceof Record ).toBe(true);
  });

  test('expect record to have a title property', () => {
    expect(r.title).toEqual("Abbey Road");
  });
  
  test('expect record to have a image_url property', () => {
    expect(r.image_url).toEqual("www.mock.com/ablum.jpg");
  });
  
  test('expect record to have an artist property', () => {
    expect(r.artist).toEqual("The Beatles");
  });
  
  test('expect record to have a genre property', () => {
    expect(r.genre).toEqual("Rock");
  });
})