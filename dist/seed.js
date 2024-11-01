"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/seed.ts
const prisma_1 = __importDefault(require("./prisma"));
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma_1.default.unitOfMeasure.createMany({
            data: [
                { name: 'KG' },
                { name: 'LITER' },
                { name: 'PIECE' },
                { name: 'BOX' },
                { name: 'METER' },
                { name: 'SACK' },
                { name: 'BUNDLE' },
                { name: 'SERVE' }, // Already added earlier, keeping it here
                { name: 'BUDGET' }, // Newly added
                { name: 'BUCKET' }, // Newly added
                { name: 'COMBO' }, // Newly added
                { name: 'DOZEN' },
                { name: 'PACK' },
                { name: 'GRAM' },
                { name: 'GALLON' },
                { name: 'OTHER' } // Last item
            ],
            skipDuplicates: true, // Prevents adding duplicates
        });
    });
}
seed()
    .catch((e) => console.error(e))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$disconnect();
}));
