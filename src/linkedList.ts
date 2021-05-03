interface ILinkedList<T> {
    insertAtBegin(data: T): Node<T>;
    insertAtEnd(data: T): Node<T>;
    deleteFirst(): void;
    deleteLast(): void;
    traverse(): T[];
    size(): number;
    search(comparator: (data: T) => boolean): Node<T> | null;
}
export class LinkedList<T> implements ILinkedList<T> {
    public head: Node<T> | null = null;

    public ifEmpty(): boolean {
        return !this.head ? true : false;
    }

    public insertAtEnd(data: T): Node<T> {
        const node = new Node(data);
        if (!this.head) {
            this.head = node;
        } else {
            const getLast = (node: Node<T>): Node<T> => {
                return node.next ? getLast(node.next) : node;
            };

            const lastNode = getLast(this.head);
            lastNode.next = node;
        }
        return node;
    }

    public insertAtBegin(data: T): Node<T> {
        const node = new Node(data);
        if (!this.head) {
            this.head = node;
        } else {
            node.next = this.head;
            this.head = node;
        }
        return node;
    }

    public deleteFirst(): void {
        if (this.head) {
            this.head = this.head.next;
        }
    }

    public deleteLast(): void {
        if (this.head) {
            var node: Node<T> = this.head;
            while (node.next !== null && node.next.next !== null) {
                node = node.next;
            }
            node.next = null;
        }
    }

    public search(comparator: (data: T) => boolean): Node<T> | null {
        const checkNext = (node: Node<T>): Node<T> | null => {
            if (comparator(node.data)) {
                return node;
            }
            return node.next ? checkNext(node.next) : null;
        };

        return this.head ? checkNext(this.head) : null;
    }

    public traverse(): T[] {
        const array: T[] = [];
        if (!this.head) {
            return array;
        }

        const addToArray = (node: Node<T>): T[] => {
            array.push(node.data);
            return node.next ? addToArray(node.next) : array;
        };
        return addToArray(this.head);
    }

    public size(): number {
        return this.traverse().length;
    }
}
export class Node<T> {
    public next: Node<T> | null = null;
    constructor(public data: T) {}
}
