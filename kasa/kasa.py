#!/usr/bin/env python

import tkinter as tk
import tkinter.font as tkFont
import tkinter.ttk as ttk


class McListBox(object):
    def __init__(self, master=None):
        self.tree = None
        self.master = master
        container = ttk.Frame(self.master)
        container.pack(fill='both', expand=True)
        # create a treeview with dual scrollbars
        self.tree = ttk.Treeview(columns=car_header, show="headings")
        vsb = ttk.Scrollbar(orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=vsb.set)
        self.tree.grid(column=0, row=0, sticky='nsew', in_=container)
        vsb.grid(column=1, row=0, sticky='ns', in_=container)
        container.grid_columnconfigure(0, weight=1)
        container.grid_rowconfigure(0, weight=1)
        for col in car_header:
            self.tree.heading(col,
                              text=col.title(),
                              command=lambda c=col: sortby(self.tree, c, 0))
            # adjust the column's width to the header string
            self.tree.column(col, width=tkFont.Font().measure(col.title()))
        for item in car_list:
            self.tree.insert('', 'end', values=item)
            # adjust column's width if necessary to fit each value
            # for ix, val in enumerate(item):
            #     col_w = tkFont.Font().measure(val)
            #     if self.tree.column(car_header[ix], width=None) < col_w:
            #         self.tree.column(car_header[ix], width=col_w)        


def sortby(tree, col, descending):
    mc_listbox.tree.selection_remove(mc_listbox.tree.selection())
    """sort tree contents when a column header is clicked on"""
    # grab values to sort
    data = [(tree.set(child, col), child) \
        for child in tree.get_children('')]
    # if the data to be sorted is numeric change to float
    #data =  change_numeric(data)
    # now sort the data in place
    data.sort(reverse=descending)
    for ix, item in enumerate(data):
        tree.move(item[1], '', ix)
    # switch the heading so it will sort in the opposite direction
    tree.heading(col, command=lambda col=col: sortby(tree, col, \
        int(not descending)))


# the test data ...
car_header = ['naziv', 'cijena', 'kol.']
car_list = [['Hyundai with really really really long name like really long its like long that it wont fit in this box', 'brakes', 34], ('Honda', 'light'), ('Lexus', 399),
            ('Benz', 'wiper'), ('Ford', 'tire'), ('Chevy', 400),
            ('Chevy', 'air'), ('Chevy', 'air'), ('Chevy', 'air'),
            ('Chevy', 'air'), ('Chevy', 'air'), ('Chevy', 'air'),
            ('Chevy', 'air'), ('Chevy', 'air'), ('Chevy', 'air'),
            ('Chevy', 'air'), ('Chevy', 'air'), ('Chevy', 'air'),
            ('Chrysler', 'piston'), ('Toyota', 'brake pedal'), ('BMW', 'seat')]

root = tk.Tk()

# start in full screen

root.geometry('800x600')
# root.attributes('-zoomed', True)

# if it doesn't work on windows try:
# w, h = root.winfo_screenwidth(), root.winfo_screenheight()
# root.geometry("%dx%d+0+0" % (w, h))

root.wm_title("amadeus kasa")

# >>>

note = ttk.Notebook(root)

tab1 = ttk.Frame(note)
tab2 = ttk.Frame(note)

mc_listbox = McListBox(tab1)

tk.Button(tab2, text='Exit', command=root.destroy).pack(padx=200,
                                                        pady=100,
                                                        expand=True)

note.add(tab1, text="Proizvodi")
note.add(tab2, text="Računi")
note.pack(fill="both", expand=True)


def selectItem(a):
    print(mc_listbox.tree.selection())


mc_listbox.tree.bind('<Delete>', selectItem)

m = tk.Menu(root, tearoff=0)
m.add_command(label="Cut", accelerator="Ctrl+Q")
m.add_command(label="Copy")
m.add_command(label="Paste")
m.add_command(label="Reload")
m.add_separator()
m.add_command(label="Rename")


def do_popup(event):
    child_id = mc_listbox.tree.identify_row(event.y)
    mc_listbox.tree.selection_set(child_id)
    m.tk_popup(event.x_root, event.y_root)


mc_listbox.tree.bind("<Button-3>", do_popup)


def open_product(event):
    items = mc_listbox.tree.selection()
    for item in items:
        info = mc_listbox.tree.item(item)
        top = tk.Toplevel()
        top.title('Product view')
        ttk.Label(top, text=info['values'][0]).pack()
        tk.Button(top, text="close window", command=top.destroy).pack()

mc_listbox.tree.bind('<Return>', open_product)
mc_listbox.tree.bind('<Double-Button-1>', open_product)


# <<<

root.mainloop()
