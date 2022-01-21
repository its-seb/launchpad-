import Dexie from 'dexie';

const db = new Dexie("MyImgDb");
db.version(1).stores({
    layers: '++id, layerid, layer, name, image, rarity',
    layerNames: '++id, layer, index, rarity'
});

export default db