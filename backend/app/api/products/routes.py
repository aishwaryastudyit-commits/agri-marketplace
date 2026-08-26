from fastapi import APIRouter

router = APIRouter()


products = [
    {
        "id": 1,
        "name": "Tomatoes",
        "price": 40,
        "quantity": 100,
        "farmer": "Farmer Ravi"
    },
    {
        "id": 2,
        "name": "Potatoes",
        "price": 30,
        "quantity": 200,
        "farmer": "Farmer Kumar"
    }
]


@router.get("/")
def get_products():
    return products

@router.post("/")
def add_product(product: dict):
    new_product = {
        "id": len(products) + 1,
        **product
    }

    products.append(new_product)

    return new_product