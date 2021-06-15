# DDD

## 1. Layers
Outer to inner

### 1.1 Main
> Configuration Layer

Wraps all together

### 1.2 Presentation
> Entrypoints layer

Gives app access to outside world.

#### 1.2.1 Infrastructure
Connects to databases, queue services, etc.
#### 1.2.2 Controllers
Connects to UI

### 1.3 Data
> Usecases

Glues repositories with controllers

### 1.4 Domain
> Entities

DTOs basically
